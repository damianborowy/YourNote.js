import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import styles from "./RegisterPage.module.scss";
import userApi from "../apis/UserAPI";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import ApiResponse from "../apis/ApiResponse";
import { Grid, TextField, Button } from "@material-ui/core";
import { Translation } from "react-i18next";

interface IRegisterPageState {
    email: string;
    password: string;
    confirmed: string;
    goBack: boolean;
    regSucc: ApiResponse | null;
}

class RegisterPage extends Component<{}, IRegisterPageState> {
    state: Readonly<IRegisterPageState> = {
        email: "",
        password: "",
        confirmed: "",
        goBack: false,
        regSucc: null
    };

    handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
                    <Translation>
                        {(t) => (
                            <Alert severity="error">
                                <AlertTitle>{t("register.error")}</AlertTitle>
                                {t("register.userExists")}
                            </Alert>
                        )}
                    </Translation>
                );
            }
        }
    };

    validatePassword = () => this.state.password === this.state.confirmed;

    render() {
        return (
            <Translation>
                {(t) => (
                    <div className={styles.containerParent}>
                        <Grid
                            container
                            spacing={2}
                            className={styles.container}
                        >
                            {this.renderAlertErr()}
                            <Grid item xs={12}>
                                <h1 className={styles.headers}>Your Note</h1>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    className={styles.textField}
                                    id="mailReg"
                                    label={t("register.email")}
                                    variant="filled"
                                    onChange={this.handleEmailChange}
                                    type="email"
                                    error={
                                        !this.validateMail() &&
                                        this.state.email.length !== 0
                                    }
                                    helperText={
                                        !this.validateMail() &&
                                        this.state.email.length !== 0
                                            ? t("register.emailError")
                                            : ""
                                    }
                                    required
                                ></TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    type="password"
                                    className={styles.textField}
                                    id="Pass"
                                    label={t("register.password")}
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
                                    id="ConfPass"
                                    label={t("register.confirmPassword")}
                                    helperText={
                                        !this.validatePassword()
                                            ? t("register.passwordsNoMatch")
                                            : ""
                                    }
                                    required
                                    variant="filled"
                                    onChange={this.handleConfirmChange}
                                ></TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    id="regButt"
                                    variant="contained"
                                    className={styles.button}
                                    onClick={this.handleRegisterButtonClick}
                                    disabled={
                                        !this.validatePassword() ||
                                        !this.validateMail() ||
                                        this.state.password.length === 0 ||
                                        this.state.email.length === 0 ||
                                        (!this.validateMail() &&
                                            this.state.email.length !== 0)
                                    }
                                >
                                    {t("register.register")}
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                {this.renderGoBack()}
                                <Button
                                    className={styles.buttonLink}
                                    id="SignInButt"
                                    variant="outlined"
                                    color="primary"
                                    onClick={this.handleGoBackButtonClick}
                                >
                                    {t("register.signIn")}
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                )}
            </Translation>
        );
    }
}

export default RegisterPage;
