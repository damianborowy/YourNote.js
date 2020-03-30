import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import styles from "./RegisterPage.module.scss";
import userApi from "../apis/UserAPI";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import ApiResponse from "../apis/ApiResponse";
import { Grid, TextField, Button } from "@material-ui/core";

interface IRegisterPageState {
    email: string;
    password: string;
    confirmed: string;
    goBack: boolean;
    regSucc: ApiResponse;
}
class RegisterPage extends Component<{}, IRegisterPageState> {
    state: Readonly<IRegisterPageState> = {
        email: "",
        password: "",
        confirmed: "",
        goBack: false,
        regSucc: null!
    };

    handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ email: event.target.value });
    };

    handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            password: event.target.value
        });
    };

    handleConfirmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            confirmed: event.target.value
        });
    };

    handleRegisterButtonClick = async () => {
        const { email, password } = this.state;

        const response = await userApi.register(email, password);

        if (response.success) {
            this.setState({ goBack: true });
        } else {
            this.setState({ regSucc: response });
        }
    };

    handleGoBackButtonClick = () => {
        this.setState({ goBack: true });
    };

    validateMail = () => {
        var re = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
        return re.test(this.state.email);
    };

    renderGoBack = () => {
        if (this.state.goBack) {
            if (this.state.regSucc) {
                if (this.state.regSucc.success) {
                    return (
                        <Redirect
                            to={{
                                pathname: "/",
                                state: { param: this.state.regSucc }
                            }}
                        ></Redirect>
                    );
                }
            }
            return <Redirect to="/"></Redirect>;
        }
    };

    renderAlertErr = () => {
        if (this.state.regSucc) {
            if (!this.state.regSucc.success) {
                return (
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {this.state.regSucc.payload}
                    </Alert>
                );
            }
        }
    };

    validatePassword = () => {
        if (this.state.password === this.state.confirmed) {
            return true;
        }
        return false;
    };

    render() {
        return (
            <div className={styles.containerParent}>
                <Grid container spacing={2} className={styles.container}>
                    {this.renderAlertErr()}
                    <Grid item xs={12}>
                        <h1 className={styles.headers}>Your Note</h1>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            className={styles.textField}
                            id="filled-basic"
                            label="e-mail"
                            variant="filled"
                            onChange={this.handleLoginChange}
                            type="email"
                            error={
                                !this.validateMail() &&
                                this.state.email.length !== 0
                            }
                            helperText={
                                !this.validateMail() &&
                                this.state.email.length !== 0
                                    ? "Email address is invalid."
                                    : ""
                            }
                            required
                        ></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            type="password"
                            className={styles.textField}
                            id="filled-basic"
                            label="Password"
                            variant="filled"
                            onChange={this.handlePasswordChange}
                            required
                        ></TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            type="password"
                            error={!this.validatePassword()}
                            className={styles.textField}
                            id="filled-error-helper-text"
                            label="Confirm password"
                            helperText={
                                !this.validatePassword()
                                    ? "Passwords don't match."
                                    : ""
                            }
                            required
                            variant="filled"
                            onChange={this.handleConfirmChange}
                        ></TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            className={styles.button}
                            onClick={this.handleRegisterButtonClick}
                            disabled={
                                !this.validatePassword() ||
                                !this.validateMail ||
                                this.state.password.length === 0 ||
                                this.state.email.length === 0 ||
                                (!this.validateMail() &&
                                    this.state.email.length !== 0)
                            }
                        >
                            Register
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        {this.renderGoBack()}
                        <Button
                            className={styles.buttonLink}
                            variant="outlined"
                            color="primary"
                            onClick={this.handleGoBackButtonClick}
                        >
                            sign in instead
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default RegisterPage;
