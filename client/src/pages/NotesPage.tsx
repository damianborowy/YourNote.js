import React, { useState, useEffect, useCallback, useRef } from "react";
import { Redirect } from "react-router-dom";
import styles from "./NotesPage.module.scss";
import { isTokenPresent, removeToken } from "../utils/TokenHandler";
import { Fab, CircularProgress, useTheme } from "@material-ui/core";
import { Add } from "@material-ui/icons/";
import NoteModel from "../models/Note";
import Container from "@material-ui/core/Container";
import noteApi from "../apis/NoteAPI";
import viewApi from "../apis/ViewAPI";
import { withThemeProvider } from "../components/DarkModeProvider";
import NotesGrid from "../components/NotesPage/NotesGrid";
import Drawer from "../components/NotesPage/Drawer";
import { getEmailFromToken } from "../utils/TokenHandler";
import AppBar from "../components/NotesPage/AppBar";
import FilterSettings from "../models/FilterSettings";
import View from "../models/View";
import _ from "lodash";

const NotesPage = () => {
    const theme = useTheme(),
        [logOut, setLogOut] = useState(false),
        [notes, setNotes] = useState<NoteModel[] | null>(null),
        [filteredNotes, setFilteredNotes] = useState<NoteModel[] | null>(null),
        [drawerOpen, setDrawerOpen] = useState(false),
        [views, setViews] = useState<View[] | null>(null),
        [selectedView, setSelectedView] = useState<View | null>(null),
        prevNotesLength = useRef(-1),
        prevViews = useRef<View[] | null>(null);

    useEffect(() => {
        (async () => {
            const notes = await noteApi.read();
            setNotes(notes.payload);

            const views = await viewApi.getViews();
            setViews(views.payload);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (views && !_.isEqual(views, prevViews.current)) {
                if (!selectedView || !notes) return;

                const newFilteredNotes = selectedView.notes.map((noteId) =>
                    notes.find((note) => note._id === noteId)
                );

                setFilteredNotes(newFilteredNotes as NoteModel[]);

                const result = await viewApi.updateViews(views);

                prevViews.current = views;
                setViews(result.payload);
            }
        })();
    }, [views, selectedView, notes]);

    useEffect(() => {
        if (!selectedView && views) setSelectedView(views[0]);
    }, [views, selectedView]);

    useEffect(() => {
        if (!selectedView || !notes) return;

        const newFilteredNotes = selectedView.notes.map((noteId) =>
            notes.find((note) => note._id === noteId)
        );

        setFilteredNotes(newFilteredNotes as NoteModel[]);
    }, [selectedView, notes]);

    useEffect(() => {
        if (!notes || !filteredNotes) return;

        if (notes.length !== prevNotesLength.current) {
            if (prevViews.current !== null) {
                const newFilteredNotes = [...filteredNotes];

                const newNotes = notes.filter(
                    (note) => !filteredNotes.includes(note)
                );
                const deletedNotes = filteredNotes.filter(
                    (note) => !notes.includes(note)
                );

                for (let note of newNotes) newFilteredNotes.push(note);

                for (let note of deletedNotes) {
                    const deletedNoteIndex = filteredNotes.indexOf(note);
                    newFilteredNotes.splice(deletedNoteIndex, 1);
                }

                setFilteredNotes(newFilteredNotes);
            }

            prevNotesLength.current = notes.length;
        }
    }, [notes, filteredNotes]);

    useEffect(() => {
        const logOut = !isTokenPresent();
        setLogOut(logOut);

        if (logOut) return;
    }, [logOut]);

    const applyFilters = useCallback(
        (filterSettings: FilterSettings, searchText: string) => {
            const _filterByText = (
                filterSettings: FilterSettings,
                searchText: string
            ): NoteModel[] => {
                if (!notes) return [];
                if (searchText.length === 0) return notes;

                const filteredNotes = [];

                if (filterSettings.titles)
                    filteredNotes.push(
                        ...notes.filter((note) =>
                            note.title
                                ?.toLowerCase()
                                .includes(searchText.toLowerCase())
                        )
                    );

                if (filterSettings.contents)
                    filteredNotes.push(
                        ...notes.filter((note) =>
                            note.content
                                ?.toLowerCase()
                                .includes(searchText.toLowerCase())
                        )
                    );

                if (filterSettings.tags)
                    filteredNotes.push(
                        ...notes.filter((note) => {
                            const filteredByTags = note.tags?.filter((tag) =>
                                tag
                                    .toLowerCase()
                                    .includes(searchText.toLowerCase())
                            );

                            return filteredByTags && filteredByTags.length > 0;
                        })
                    );

                return _getUniqueNotes(filteredNotes);
            };

            const _filterByColors = (colors: string[]): NoteModel[] => {
                if (!notes) return [];
                if (colors.length === 0) return notes;

                const filteredNotes = notes.filter((note) =>
                    colors.includes(note.color.toLowerCase())
                );

                return _getUniqueNotes(filteredNotes);
            };

            const _getUniqueNotes = (notes: NoteModel[]): NoteModel[] => {
                const result = [];
                const map = new Map();
                for (const note of notes) {
                    if (!map.has(note._id)) {
                        map.set(note._id, true);
                        result.push(note);
                    }
                }

                return result;
            };

            if (!notes) return;

            if (
                filterSettings.selectedColors.length === 0 &&
                searchText === ""
            ) {
                return setFilteredNotes([...notes]);
            }

            const notesFilteredByText = _filterByText(
                filterSettings,
                searchText
            );
            const notesFilteredBySettings = _filterByColors(
                filterSettings.selectedColors
            );

            if (
                notesFilteredByText.length === 0 &&
                notesFilteredBySettings.length === 0
            ) {
                return setFilteredNotes([]);
            }

            const intersectedNotes = notesFilteredByText.filter((note) =>
                notesFilteredBySettings.includes(note)
            );

            setFilteredNotes(intersectedNotes);
        },
        [notes]
    );

    const deleteNoteFromList = (oldNote: NoteModel) => {
        if (!notes) return;

        const newNotes = notes.filter((note) => note._id !== oldNote._id);
        const newViews = [...views];

        newViews.forEach((view) => {
            if (view.notes.includes(oldNote._id)) {
                const targetNoteIndex = view.notes.indexOf(oldNote._id);
                view.notes.splice(targetNoteIndex, 1);
            }
        });

        const currentViewIndex = newViews.findIndex(
            (view) => view.name === selectedView?.name
        );

        setNotes(newNotes);
        setViews(newViews);
        setSelectedView(newViews[currentViewIndex]);
    };

    const handleLogOutButtonClick = () => {
        removeToken();
        setLogOut(!isTokenPresent());
    };

    const renderLogOut = () => {
        if (logOut) return <Redirect to="/"></Redirect>;
    };

    const onDrawerOpen = () => setDrawerOpen(true);

    const onDrawerClose = () => setDrawerOpen(false);

    const onFabClick = async () => {
        const result = await noteApi.create();

        if (!result.success || !views) return;

        setSelectedView(views[0]);

        const newNote = result.payload as NoteModel;
        newNote.wasJustCreated = true;

        const newViews = [...views];

        newViews[0].notes.push(newNote._id);

        setViews(newViews);
        setNotes([...notes, newNote]);
    };

    return (
        <div className={styles.app} id="div1">
            <AppBar onDrawerOpen={onDrawerOpen} applyFilters={applyFilters} />
            <Drawer
                notes={filteredNotes}
                drawerOpen={drawerOpen}
                onDrawerClose={onDrawerClose}
                onDrawerOpen={onDrawerOpen}
                handleLogOutButtonClick={handleLogOutButtonClick}
                getEmailFromToken={getEmailFromToken}
                views={views}
                setViews={setViews}
                selectedView={selectedView}
                setSelectedView={setSelectedView}
            />
            <div
                id="div2"
                style={{ backgroundColor: theme.palette.background.paper }}
                className={styles.container}
            >
                <Container id="container">
                    {renderLogOut()}
                    {views && filteredNotes ? (
                        <>
                            <NotesGrid
                                notes={filteredNotes}
                                deleteNoteFromList={deleteNoteFromList}
                                name="My notes"
                                dndSetter={setFilteredNotes}
                                views={views}
                                setViews={setViews}
                                selectedView={selectedView}
                                setSelectedView={setSelectedView}
                            />
                            <NotesGrid
                                notes={filteredNotes}
                                deleteNoteFromList={deleteNoteFromList}
                                name="Notes shared to me"
                                dndSetter={setFilteredNotes}
                                views={views}
                                setViews={setViews}
                                selectedView={selectedView}
                                setSelectedView={setSelectedView}
                            />
                        </>
                    ) : (
                        <div className={styles.loader}>
                            <CircularProgress size={60} />
                        </div>
                    )}
                    <Fab
                        color="primary"
                        className={styles.fab}
                        onClick={onFabClick}
                    >
                        <Add />
                    </Fab>
                </Container>
            </div>
        </div>
    );
};

export default withThemeProvider(NotesPage);
