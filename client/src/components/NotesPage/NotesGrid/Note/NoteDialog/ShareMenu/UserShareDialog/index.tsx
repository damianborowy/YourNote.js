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
import NoteModel from "../../../../../../../models/Note";
import userApi from "../../../../../../../apis/UserAPI";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { useTranslation } from "react-i18next";

interface IUserShareDialogProps {
    subShareToUserDialogClose: () => void;
    subToUserDialogOpen: boolean;
    note: NoteModel;
    handleNoteChange: (note: NoteModel) => void;
}

const UserShareDialog = (props: IUserShareDialogProps) => {
    const [email, setEmail] = React.useState(""),
        [errorMess, setErrorMess] = React.useState(""),
        { t } = useTranslation();

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
            <DialogTitle>{t("notes.card.newUser")}</DialogTitle>
            <DialogContent>
                {errorMess !== "" && (
                    <Alert
                        variant="filled"
                        severity="error"
                        className={styles.alert}
                    >
                        <AlertTitle>{t("notes.card.invalidEmail")}</AlertTitle>
                    </Alert>
                )}

                {props.note.sharedTo &&
                    props.note.sharedTo.map((email) => {
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
                        label={t("register.email")}
                        variant="filled"
                        onChange={handleEmailChange}
                        value={email}
                        type="email"
                        error={!validateMail() && email !== ""}
                        helperText={
                            !validateMail() && email !== ""
                                ? t("register.emailError")
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
                    {t("notes.card.close")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserShareDialog;
