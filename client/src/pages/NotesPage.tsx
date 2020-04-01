import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import styles from "./NotesPage.module.scss";
import Grid from "@material-ui/core/Grid";
import { isTokenPresent, removeToken } from "../utils/TokenHandler";
import {
    Fab,
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    Divider
} from "@material-ui/core";
import { Add, Menu } from "@material-ui/icons/";
import NoteModel from "../models/Note";
import Container from "@material-ui/core/Container";
import Note from "../components/Note";
import noteApi from "../apis/NoteAPI";

interface INotesPageState {
    logOut: boolean;
    notes: NoteModel[];
    drawerOpen: boolean;
}

class NotesPage extends Component<{}, INotesPageState> {
    state: Readonly<INotesPageState> = {
        logOut: false,
        notes: new Array<NoteModel>(),
        drawerOpen: false
    };

    async componentDidMount() {
        const logOut = !isTokenPresent();
        this.setState({ logOut });

        if (logOut) return;

        const result = await noteApi.read();

        this.setState({ notes: result.payload });
    }

    deleteNoteFromList = (oldNote: NoteModel) => {
        const notes = this.state.notes.filter(note => note._id !== oldNote._id);

        this.setState({ notes });
    };

    handleLogOutButtonClick = () => {
        removeToken();
        this.setState({ logOut: !isTokenPresent() });
    };

    renderLogOut = () => {
        if (this.state.logOut) {
            return <Redirect to="/"></Redirect>;
        }
    };

    onDrawerOpen = () => this.setState({ drawerOpen: true });
    onDrawerClose = () => this.setState({ drawerOpen: false });

    onFabClick = async () => {
        const result = await noteApi.create();

        if (!result) return; // TODO:: <Alert /> z błędem

        const newNote = result.payload;
        newNote.wasJustCreated = true;

        this.setState({ notes: [...this.state.notes, newNote] });
    };

    render() {
        return (
            <>
                <AppBar
                    position="static"
                    className={styles.bar}
                    color="default"
                >
                    <Toolbar>
                        <IconButton edge="start" onClick={this.onDrawerOpen}>
                            <Menu />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer className={styles.drawer} open={this.state.drawerOpen}>
                    <Divider />
                    <Button
                        variant="text"
                        color="primary"
                        onClick={this.handleLogOutButtonClick}
                    >
                        Log out
                    </Button>
                </Drawer>
                <Container>
                    {this.renderLogOut()}
                    <Grid container spacing={1} className={styles.container}>
                        {this.state.notes.length > 0 &&
                            this.state.notes.map(note => {
                                return (
                                    <Grid
                                        item
                                        xs={6}
                                        sm={4}
                                        md={3}
                                        key={note._id}
                                    >
                                        <Note
                                            model={note}
                                            deleteNoteFromList={
                                                this.deleteNoteFromList
                                            }
                                        />
                                    </Grid>
                                );
                            })}
                    </Grid>
                    <Fab
                        color="primary"
                        className={styles.fab}
                        onClick={this.onFabClick}
                    >
                        <Add />
                    </Fab>
                </Container>
            </>
        );
    }
}

export default NotesPage;
