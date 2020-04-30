import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import styles from "./NotesPage.module.scss";
import { isTokenPresent, removeToken } from "../utils/TokenHandler";
import { Fab, CircularProgress, useTheme } from "@material-ui/core";
import { Add } from "@material-ui/icons/";
import NoteModel from "../models/Note";
import Container from "@material-ui/core/Container";
import noteApi from "../apis/NoteAPI";
import { withThemeProvider } from "../components/DarkModeProvider";
import NotesGrid from "../components/NotesPage/NotesGrid";
import Drawer from "../components/NotesPage/Drawer";
import { getEmailFromToken } from "../utils/TokenHandler";
import AppBar from "../components/NotesPage/AppBar";

const NotesPage = () => {
    const theme = useTheme(),
        [logOut, setLogOut] = useState(false),
        [notes, setNotes] = useState<NoteModel[] | null>(null),
        [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            const result = await noteApi.read();
            setNotes(result.payload);
        };

        fetchNotes();
    }, []);

    useEffect(() => {
        const logOut = !isTokenPresent();
        setLogOut(logOut);

        if (logOut) return;
    }, [logOut]);

    const deleteNoteFromList = (oldNote: NoteModel) => {
        if (!notes) return;

        const newNotes = notes.filter((note) => note._id !== oldNote._id);

        setNotes(newNotes);
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

        if (!result) return;

        const newNote = result.payload;
        newNote.wasJustCreated = true;

        setNotes([...notes, newNote]);
    };

    return (
        <div className={styles.app}>
            <AppBar onDrawerOpen={onDrawerOpen} />
            <Drawer
                drawerOpen={drawerOpen}
                onDrawerClose={onDrawerClose}
                onDrawerOpen={onDrawerOpen}
                handleLogOutButtonClick={handleLogOutButtonClick}
                getEmailFromToken={getEmailFromToken}
            />
            <div
                style={{ backgroundColor: theme.palette.background.paper }}
                className={styles.container}
            >
                <Container>
                    {renderLogOut()}
                    {notes ? (
                        <>
                            <NotesGrid
                                notes={notes.filter(
                                    (note) => note.owner === getEmailFromToken()
                                )}
                                deleteNoteFromList={deleteNoteFromList}
                                name="My notes"
                            />
                            <NotesGrid
                                notes={notes.filter(
                                    (note) => note.owner !== getEmailFromToken()
                                )}
                                deleteNoteFromList={deleteNoteFromList}
                                name="Notes shared to me"
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
