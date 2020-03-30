import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import styles from "./NotesPage.module.scss";
import Grid from "@material-ui/core/Grid";
import { isTokenPresent, removeToken } from "../utils/TokenHandler";
import { Fab, Card, CardContent } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Note from "../models/Note";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";

interface INotesPage {
    logOut: boolean;
    notes: Note[];
}

class NotesPage extends Component<{}, INotesPage> {
    state: Readonly<INotesPage> = {
        logOut: false,
        notes: []
    };

    componentDidMount() {
        const logOut = !isTokenPresent();

        this.setState({ logOut });

        if (!logOut) {
        }
    }

    handleLogOutButtonClick = () => {
        removeToken();
        this.setState({ logOut: !isTokenPresent() });
    };

    renderLogOut = () => {
        if (this.state.logOut) {
            return <Redirect to="/"></Redirect>;
        }
    };

    render() {
        return (
            <Container>
                {this.renderLogOut()}
                <Grid container spacing={2} className={styles.container}>
                    {new Array(20).fill(0).map(i => {
                        return (
                            <Grid item xs={6} sm={4} md={3}>
                                <Card variant="outlined">
                                    <CardContent>Some text lala</CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={this.handleLogOutButtonClick}
                >
                    Log out
                </Button>
                <Fab color="primary" className={styles.fab}>
                    <AddIcon />
                </Fab>
            </Container>
        );
    }
}

export default NotesPage;
