import React, { useState, useEffect } from "react";
import styles from "./UsersTab.module.scss";
import {
    Container,
    Typography,
    Fab,
    DialogTitle,
    DialogContent,
    Dialog,
    Box,
    TextField,
    DialogActions,
    Button
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import UserModel from "../../../models/User";
import adminApi from "../../../apis/AdminAPI";
import _ from "lodash";
import User from "./User";
import { useTranslation } from "react-i18next";

const sortUsers = (users: UserModel[]) => {
    users.sort((a: UserModel, b: UserModel) => {
        if (a.email < b.email) return -1;
        if (a.email > b.email) return 1;
        return 0;
    });
};

const UsersTab = () => {
    const [users, setUsers] = useState<UserModel[] | null>(null),
        [open, setOpen] = useState(false),
        [email, setEmail] = useState(""),
        [password, setPassword] = useState(""),
        [confirmedPassword, setConfirmedPassword] = useState(""),
        { t } = useTranslation();

    useEffect(() => {
        const fetchUsers = async () => {
            const result = await adminApi.readAllUsers();

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
        <>
            <Container>
                <div className={styles.container}>
                    <Typography
                        style={{ padding: 10 }}
                        variant="h6"
                        component="h6"
                    >
                        {t("admin.admins")}
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
                        {t("admin.users")}
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
                <DialogTitle>{t("admin.newUser")}</DialogTitle>
                <DialogContent>
                    <Box padding={2}>
                        <div className={styles.input}>
                            <TextField
                                id="adminMail"
                                label={t("register.email")}
                                variant="filled"
                                onChange={handleEmailChange}
                                type="email"
                                error={!validateMail() && email.length !== 0}
                                helperText={
                                    !validateMail() && email.length !== 0
                                        ? t("register.emailError")
                                        : ""
                                }
                                required
                            />
                        </div>
                        <div className={styles.input}>
                            <TextField
                                id="AdminPass1"
                                type="password"
                                label={t("register.password")}
                                variant="filled"
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <div className={styles.input}>
                            <TextField
                                type="password"
                                error={!validatePassword()}
                                id="passwordAdmin"
                                label={t("register.confirmPassword")}
                                helperText={
                                    !validatePassword()
                                        ? t("register.passwordsNoMatch")
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
                    <Button onClick={closeDialog}>{t("admin.close")}</Button>
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
                        {t("admin.add")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UsersTab;
