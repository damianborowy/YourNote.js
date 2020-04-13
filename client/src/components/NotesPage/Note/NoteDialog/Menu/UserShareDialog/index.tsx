import React from "react";
import {
    Dialog,
    DialogTitle,
    TextField,
    DialogContent,
    IconButton,
    Button,
    DialogActions,
    Typography
} from "@material-ui/core";
import { AddBox, Delete } from "@material-ui/icons";
import styles from "./UserShareDialog.module.scss";
import NoteModel from "../../../../../../models/Note";
import userApi from "../../../../../../apis/UserAPI";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

interface IUserShareDialogProps {
    subShareToUserDialogClose: () => void;
    subToUserDialogOpen: boolean;
    note: NoteModel;
    handleNoteChange: (note: NoteModel) => void;
}

const UserShareDialog = (props: IUserShareDialogProps) => {
    const [email, setEmail] = React.useState("");
    const [errorMess, setErrorMess] = React.useState("");

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const checkIfSharingIsPossible = (): boolean => {
        return (
            validateMail() &&
            !props.note.sharedTo!.includes(email) &&
            props.note.owner !== email &&
            email !== ""
        );
    };

    const validateMail = () => {
        var re = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
        return re.test(email);
    };

    const handleAddUserToShare = async () => {
        const response = await userApi.checkIfEmailExists(email);
        if (response.success && checkIfSharingIsPossible()) {
            const newNote = { ...props.note };
            newNote.sharedTo!.push(email);
            props.handleNoteChange(newNote);
            setEmail("");
            setErrorMess("");
        } else {
            setErrorMess("Provided email is not valid");
            setTimeout(() => setErrorMess(""), 5000);
        }
    };
    const handleRemoveUser = (emailToDel: string) => {
        const newNote = { ...props.note };
        var index = newNote.sharedTo!.findIndex((email) => {
            return emailToDel === email;
        });
        newNote.sharedTo!.splice(index, 1);
        props.handleNoteChange(newNote);
    };

    return (
        <Dialog
            open={props.subToUserDialogOpen}
            onClose={props.subShareToUserDialogClose}
        >
            <DialogTitle>Share note to other users</DialogTitle>
            <DialogContent>
                {errorMess !== "" && (
                    <Alert
                        variant="filled"
                        severity="error"
                        className={styles.alert}
                    >
                        <AlertTitle>{errorMess}</AlertTitle>
                    </Alert>
                )}

                {props.note.sharedTo!.map((email) => {
                    return (
                        <div className={styles.flexRow} key={email}>
                            <Typography>{email}</Typography>
                            <IconButton
                                className={styles.iconButton}
                                onClick={() => handleRemoveUser(email)}
                            >
                                <Delete />
                            </IconButton>
                        </div>
                    );
                })}

                <div className={styles.flexRow}>
                    <TextField
                        label="e-mail"
                        variant="filled"
                        onChange={handleEmailChange}
                        value={email}
                        type="email"
                        error={!validateMail() && email !== ""}
                        helperText={
                            !validateMail() && email !== ""
                                ? "Email address is invalid."
                                : ""
                        }
                    />
                    <IconButton
                        className={styles.iconButton}
                        onClick={handleAddUserToShare}
                        disabled={!validateMail()}
                    >
                        <AddBox />
                    </IconButton>
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={props.subShareToUserDialogClose}
                    color="primary"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserShareDialog;
