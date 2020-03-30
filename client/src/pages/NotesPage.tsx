import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import styles from "./RegisterPage.module.scss";
import Grid from "@material-ui/core/Grid";
import { isTokenPresent, removeToken } from "../utils/TokenHandler";

interface INotesPage {
    logOut: boolean;
}
class NotesPage extends Component<{}, INotesPage> {
    state: Readonly<INotesPage> = {
        logOut: false
    };

    componentDidMount() {
        this.setState({ logOut: !isTokenPresent() });
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
            <div>
                <Grid container spacing={2} className={styles.container}>
                    <Grid item xs={12}>
                        <h1 className={styles.headers}>Authorized</h1>
                    </Grid>
                    <Grid item xs={12}>
                        {this.renderLogOut()}
                        <Button
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
