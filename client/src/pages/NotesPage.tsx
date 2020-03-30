import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import styles from "./RegisterPage.module.scss";
import Grid from "@material-ui/core/Grid";
import { isTokenPresent, removeToken } from "../utils/TokenHandler";

interface INotesPage {
    goBack: boolean;
}
class NotesPage extends Component<{}, INotesPage> {
    state: Readonly<INotesPage> = {
        goBack: false
    };

    componentDidMount() {
        this.setState({ goBack: !isTokenPresent() });
    }

    handleLogOutButtonClick = () => {
        removeToken();
        this.setState({ goBack: !isTokenPresent() });
    };

    renderGoBack = () => {
        if (this.state.goBack) {
            return <Redirect to="/"></Redirect>;
        }
    };

    render() {
        return (
            <div className={styles.containerParent}>
                <Grid container spacing={2} className={styles.container}>
                    <Grid item xs={12}>
                        <h1 className={styles.headers}>Authorized</h1>
                    </Grid>
                    <Grid item xs={12}>
                        {this.renderGoBack()}
                        <Button
                            className={styles.buttonLink}
                            variant="outlined"
                            color="primary"
                            onClick={this.handleLogOutButtonClick}
                        >
                            Log out
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default NotesPage;
