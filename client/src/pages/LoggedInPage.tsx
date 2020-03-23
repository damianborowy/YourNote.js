import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import styles from "./RegisterPage.module.scss";
import Grid from "@material-ui/core/Grid";
import userApi from "../apis/UserAPI";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import ApiResponse from "../apis/ApiResponse";
import { Router, withRouter } from "react-router-dom";

interface IRegisterPageState {
    goBack: boolean;
}
class RegisterPage extends Component<{}, IRegisterPageState> {
    state: Readonly<IRegisterPageState> = {
        goBack: false
    };
    handleGoBackButtonClick = () => {
        this.setState({ goBack: true });
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
                            onClick={this.handleGoBackButtonClick}
                        >
                            Log out
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default RegisterPage;
