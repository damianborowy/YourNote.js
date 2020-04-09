import React from "react";
import {
    Dialog,
    DialogTitle,
    TextField,
    DialogContent,
    IconButton,
    Button,
    DialogActions
} from "@material-ui/core";
import { AddBox, Delete } from "@material-ui/icons";
import styles from "./UserShareDialog.module.scss";

interface IUserShareDialogProps {
    subShareToUserDialogClose: () => void;
    subToUserDialogOpen: boolean;
}

const UserShareDialog = (props: IUserShareDialogProps) => {
    const [email, setEmail] = React.useState("");

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const validateMail = () => {
        var re = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
        return re.test(email);
    };

    return (
        <Dialog
            fullWidth
            open={props.subToUserDialogOpen}
            onClose={props.subShareToUserDialogClose}
        >
            <DialogTitle>Share note to other users</DialogTitle>
            <DialogContent>
                <TextField
                    className={styles.textField}
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
                />
                <IconButton>
                    <AddBox />
                </IconButton>
                <IconButton>
                    <Delete />
                </IconButton>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={props.subShareToUserDialogClose}
                    color="primary"
                >
                    Share
                </Button>
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
