import React, { useState, useEffect } from "react";
import styles from "./AdminPage.module.scss";
import {
    useTheme,
    Typography,
    Container,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField,
    IconButton
} from "@material-ui/core";
import adminApi from "../apis/AdminAPI";
import _ from "lodash";
import { withThemeProvider } from "../components/DarkModeProvider";
import UserModel from "../models/User";
import { Add } from "@material-ui/icons";
import User from "../components/AdminPage/User";
import { ArrowBack } from "@material-ui/icons";
import { Link } from "react-router-dom";

const sortUsers = (users: UserModel[]) => {
    users.sort((a: UserModel, b: UserModel) => {
        if (a.email < b.email) return -1;
        if (a.email > b.email) return 1;
        return 0;
    });
};

const AdminPage = () => {
    const theme = useTheme(),
        [users, setUsers] = useState<UserModel[] | null>(null),
        [open, setOpen] = useState(false),
        [email, setEmail] = useState(""),
        [password, setPassword] = useState(""),
        [confirmedPassword, setConfirmedPassword] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            const result = await adminApi.readAll();

            if (_.isEmpty(result.payload)) return;

            const users = result.payload;
            sortUsers(users);

            setUsers(users);
        };

        fetchUsers();
    }, []);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setEmail(event.target.value);

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setPassword(event.target.value);

    const handleConfirmedPasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => setConfirmedPassword(event.target.value);

    const updateAndSortUsers = (newUsers: UserModel[]) => {
        sortUsers(newUsers);
        setUsers(newUsers);
    };

    const validateMail = () =>
        /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/.test(email);

    const validatePassword = () => password === confirmedPassword;

    const closeDialog = () => setOpen(false);

    const openDialog = () => setOpen(true);

    const addNewUser = async () => {
        closeDialog();

        const result = await adminApi.create(email, password);

        if (!result.success) return;

        const newUser: UserModel = result.payload;
        const newUsers = [...users, newUser];

        updateAndSortUsers(newUsers);
    };

    return (
        <div
            className={styles.page}
            style={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary
            }}
        >
            <Container>
                <div className={styles.header}>
                    <Link
                        to={"/"}
                        style={{
                            textDecoration: "none",
                            color: theme.palette.text.primary,
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        <IconButton>
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h6" component="h6">
                            Back
                        </Typography>
                    </Link>
                </div>
                <div className={styles.container}>
                    <Typography
                        style={{ padding: 10 }}
                        variant="h6"
                        component="h6"
                    >
                        Admins
                    </Typography>
                    {users &&
                        users
                            .filter((user) => user.role === "Admin")
                            .map((user) => (
                                <User
                                    user={user}
                                    users={users}
                                    updateUsers={updateAndSortUsers}
                                    key={user.email}
                                />
                            ))}
                    <Typography
                        style={{ padding: 10 }}
                        variant="h6"
                        component="h6"
                    >
                        Users
                    </Typography>
                    {users &&
                        users
                            .filter((user) => user.role === "User")
                            .map((user) => (
                                <User
                                    user={user}
                                    users={users}
                                    updateUsers={updateAndSortUsers}
                                    key={user.email}
                                />
                            ))}
                </div>
            </Container>
            <Fab color="primary" className={styles.fab} onClick={openDialog}>
                <Add />
            </Fab>
            <Dialog open={open} onClose={closeDialog}>
                <DialogTitle>Add new user</DialogTitle>
                <DialogContent>
                    <Box padding={2}>
                        <div className={styles.input}>
                            <TextField
                                label="e-mail"
                                variant="filled"
                                onChange={handleEmailChange}
                                type="email"
                                error={!validateMail() && email.length !== 0}
                                helperText={
                                    !validateMail() && email.length !== 0
                                        ? "Email address is invalid."
                                        : ""
                                }
                                required
                            />
                        </div>
                        <div className={styles.input}>
                            <TextField
                                type="password"
                                id="filled-basic"
                                label="Password"
                                variant="filled"
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <div className={styles.input}>
                            <TextField
                                type="password"
                                error={!validatePassword()}
                                id="filled-error-helper-text"
                                label="Confirm password"
                                helperText={
                                    !validatePassword()
                                        ? "Passwords don't match."
                                        : ""
                                }
                                required
                                variant="filled"
                                onChange={handleConfirmedPasswordChange}
                            />
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Close</Button>
                    <Button
                        color="primary"
                        onClick={addNewUser}
                        disabled={
                            !validatePassword() ||
                            !validateMail() ||
                            password.length === 0 ||
                            email.length === 0 ||
                            (!validateMail() && email.length !== 0)
                        }
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default withThemeProvider(AdminPage);
