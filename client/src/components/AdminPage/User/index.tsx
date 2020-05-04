import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@material-ui/core";
import UserModel from "../../../models/User";
import styles from "./User.module.scss";
import { Edit, Delete } from "@material-ui/icons";
import adminApi from "../../../apis/AdminAPI";

interface IUserProps {
    user: UserModel;
    users: UserModel[];
    updateUsers: (users: UserModel[]) => void;
}

const User = (props: IUserProps) => {
    const [editOpen, setEditOpen] = useState(false),
        [deleteOpen, setDeleteOpen] = useState(false),
        [role, setRole] = useState(props.user.role);

    const closeDialogs = () => {
        setEditOpen(false);
        setDeleteOpen(false);
    };

    const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) =>
        setRole(event.target.value as string);

    const editUsersRole = async () => {
        closeDialogs();

        const newUser = { ...props.user, role };
        const result = await adminApi.update(newUser);

        if (!result.success) return;

        const userIndex = props.users.findIndex(
            user => user.email === props.user.email
        );

        const newUsers = [...props.users];
        newUsers.splice(userIndex, 1);
        newUsers.push(newUser);

        props.updateUsers(newUsers);
    };

    const deleteUser = async () => {
        closeDialogs();

        const result = await adminApi.delete(props.user.email);

        if (!result.success) return;

        const userIndex = props.users.findIndex(
            user => user.email === props.user.email
        );

        const newUsers = [...props.users];
        newUsers.splice(userIndex, 1);

        props.updateUsers(newUsers);
    };

    return (
        <Card className={styles.card}>
            <CardContent className={styles.cardContent}>
                <Typography className={styles.typography}>
                    {props.user.email}
                </Typography>
                <div className={styles.buttons}>
                    <IconButton onClick={() => setEditOpen(true)}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => setDeleteOpen(true)}>
                        <Delete />
                    </IconButton>
                </div>
            </CardContent>
            <Dialog
                id="dialogAdmin1"
                open={editOpen}
                onClose={closeDialogs}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Change user's role</DialogTitle>
                <DialogContent>
                    <Box padding={1} className={styles.box}>
                        <Typography variant="body1" component="span">
                            {props.user.email}
                        </Typography>
                        <FormControl
                            variant="filled"
                            className={styles.formControl}
                        >
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                labelId="role-label"
                                value={role}
                                onChange={handleRoleChange}
                            >
                                <MenuItem value="User">User</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialogs}>Close</Button>
                    <Button color="primary" onClick={editUsersRole}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={deleteOpen} onClose={closeDialogs}>
                <DialogTitle>Delete user</DialogTitle>
                <DialogContent>
                    Are you sure you'd like to delete user{" "}
                    <b>{props.user.email}</b>? Keep in mind that this is a
                    destructive operation and it cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialogs}>Close</Button>
                    <Button color="secondary" onClick={deleteUser}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default User;
