import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import styles from "./LoginPage.module.scss";
import { Grid } from "@material-ui/core";
import userApi from "../apis/UserAPI";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import ApiResponse from "../apis/ApiResponse";
import { isTokenPresent } from "../utils/TokenHandler";

interface ILoginPageState {
    email: string;
    password: string;
    redirect: boolean;
    isEmailValid: boolean;
    res: ApiResponse;
    loggedIn: boolean;
}

class LoginPage extends Component<{}, ILoginPageState> {
    state: Readonly<ILoginPageState> = {
        email: "",
        password: "",
        redirect: false,
        loggedIn: false,
        isEmailValid: true,
        res: null!
    };

    componentDidMount() {
        this.setState({ loggedIn: isTokenPresent() });
    }

    handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ email: event.target.value });
    };

    handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ password: event.target.value });
    };

    handleLoginButtonClick = async () => {
        const { email, password } = this.state;

        const response = await userApi.login(email, password);
        this.setState({ res: response });

        if (response.success) {
            this.setState({ loggedIn: true });
        } else {
            this.setState({ loggedIn: false });
        }
    };

    handleRegisterButtonClick = () => {
        this.setState({ redirect: true });
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to="/register"></Redirect>;
        }
    };

    renderLoggedCorectly = () => {
        if (this.state.loggedIn) {
            return <Redirect to="/notes"></Redirect>;
        } else if (this.state.res) {
            return (
                <Alert severity="error">
                    <AlertTitle>Incorrect credentials</AlertTitle>
                    {this.state.res.payload}
                </Alert>
            );
        }
    };

    render() {
        return (
            <div className={styles.containerParent}>
                <Grid container spacing={2} className={styles.container}>
                    <Grid item xs={12}>
                        {this.renderLoggedCorectly()}
                        <h1 className={styles.headers}>Your Note</h1>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            className={styles.textField}
                            type="email"
                            id="emailLog"
                            required
                            label="e-mail"
                            variant="filled"
                            onChange={this.handleEmailChange}
                        ></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            className={styles.textField}
                            required
                            id="PassLogIn"
                            type="password"
                            label="Password"
                            variant="filled"
                            onChange={this.handlePasswordChange}
                        ></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            id="LogInButton"
                            className={styles.button}
                            onClick={this.handleLoginButtonClick}
                        >
                            Login
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        {this.renderRedirect()}
                        <Button
                            variant="contained"
                            id="RegisterButt2"
                            onClick={this.handleRegisterButtonClick}
                            className={styles.button}
                        >
                            Register
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default LoginPage;
