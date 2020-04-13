import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import styles from "./NotesPage.module.scss";
import {
    isTokenPresent,
    removeToken,
    extractToken
} from "../utils/TokenHandler";
import {
    Fab,
    AppBar,
    Toolbar,
    IconButton,
    SwipeableDrawer,
    Typography,
    CircularProgress,
    useTheme,
    Divider,
    Switch,
    FormControlLabel
} from "@material-ui/core";
import { Add, Menu } from "@material-ui/icons/";
import NoteModel from "../models/Note";
import Container from "@material-ui/core/Container";
import noteApi from "../apis/NoteAPI";
import jwt from "jsonwebtoken";
import { useStore } from "../components/DarkModeProvider";
import { withThemeProvider } from "../components/DarkModeProvider";
import NotesGrid from "../components/NotesPage/NotesGrid";

const NotesPage = () => {
    const theme = useTheme(),
        [logOut, setLogOut] = useState(false),
        [notes, setNotes] = useState<NoteModel[] | null>(null),
        [drawerOpen, setDrawerOpen] = useState(false),
        { darkMode, setDarkMode } = useStore();

    useEffect(() => {
        const fetchNotes = async () => {
            const logOut = !isTokenPresent();
            setLogOut(logOut);

            if (logOut) return;

            const result = await noteApi.read();
            setNotes(result.payload);
        };

        fetchNotes();
    }, []);

    const toggleDarkMode = () => setDarkMode(!darkMode);

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

    const getEmailFromToken = () => {
        const decodedToken = jwt.decode(extractToken());
        if (!decodedToken || typeof decodedToken !== "object") return "";

        const email: string = decodedToken.email;

        return email ?? "";
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
            <AppBar position="static" color="default">
                <Toolbar>
                    <IconButton edge="start" onClick={onDrawerOpen}>
                        <Menu />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <SwipeableDrawer
                classes={{ paper: styles.drawer }}
                open={drawerOpen}
                onClose={onDrawerClose}
                onOpen={onDrawerOpen}
            >
                <div className={styles.drawerBottom}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={darkMode}
                                color="primary"
                                onChange={toggleDarkMode}
                            />
                        }
                        label="Toggle dark mode"
                    />

                    <Divider className={styles.divider} />
                    <Typography>
                        Logged in as: <br />
                        {getEmailFromToken()}
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleLogOutButtonClick}
                        className={styles.drawerButton}
                    >
                        Log out
                    </Button>
                </div>
            </SwipeableDrawer>
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
