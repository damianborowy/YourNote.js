import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    Link,
    IconButton,
    DialogActions,
    Button,
    FormControlLabel,
    Switch
} from "@material-ui/core";
import CopyToClipboard from "react-copy-to-clipboard";
import { FileCopy } from "@material-ui/icons";
import NoteModel from "../../../../../models/Note";
import styles from "./LinkShareDialog.module.scss";

const env = process.env.NODE_ENV || "development";
const clientUrl =
    env === "development"
        ? "http://localhost:3000/notes/public/"
        : "https://yournote-client.herokuapp.com/notes/public/";

interface ILinkShareDialogProps {
    updateNote: () => void;
    note: NoteModel;
    subDialogOpen: boolean;
    subShareDialogClose: () => void;
}

const LinkShareDialog = (props: ILinkShareDialogProps) => {
    const [checkedB, setCheckedB] = React.useState(
        props.note.isPublic || false
    );

    const handleChange = () => {
        setCheckedB(!checkedB);
        props.note.isPublic = !checkedB;
        props.updateNote();
    };

    return (
        <Dialog
            fullWidth
            open={props.subDialogOpen}
            onClose={props.subShareDialogClose}
        >
            <DialogTitle>Sharing by link</DialogTitle>
            <DialogContent>
                <FormControlLabel
                    control={
                        <Switch
                            checked={checkedB}
                            onChange={handleChange}
                            color="primary"
                        />
                    }
                    label="Allow public access"
                />
                {checkedB && (
                    <Box
                        border={1}
                        borderRadius="borderRadius"
                        borderColor="grey.300"
                        display="flex"
                        alignItems="center"
                        marginTop={1}
                    >
                        <Typography className={styles.sharingCheckedTypography}>
                            <Link
                                className={styles.links}
                                href={clientUrl + props.note._id}
                            >
                                {clientUrl + props.note._id}
                            </Link>
                        </Typography>
                        <CopyToClipboard text={clientUrl + props.note._id}>
                            <IconButton>
                                <FileCopy />
                            </IconButton>
                        </CopyToClipboard>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.subShareDialogClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LinkShareDialog;
