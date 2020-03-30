import React from "react";
import styles from "./Note.module.scss";
import {
    Card,
    CardContent,
    Typography,
    Dialog,
    DialogContentText,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField
} from "@material-ui/core";
import NoteModel from "../models/Note";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import clsx from "clsx";

interface INoteProps {
    model: NoteModel;
}

const pickColorClass = (colorNum: number) => {
    return styles.color;
};

const Note = ({ model }: INoteProps) => {
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState(model.title);
    const [content, setContent] = React.useState(model.content);
    const color = model.color ? pickColorClass(model.color) : "";
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

    console.log(color);

    const openDialog = () => setOpen(true);
    const closeDialog = () => setOpen(false);

    return (
        <>
            <Card
                className={clsx(styles.card)}
                variant="outlined"
                onClick={openDialog}
            >
                <CardContent>
                    <Typography style={{ fontWeight: "bold" }}>
                        {title}
                    </Typography>
                    <Typography>{content}</Typography>
                </CardContent>
            </Card>
            <Dialog open={open} fullScreen={fullScreen}>
                <DialogTitle className={color}>
                    <TextField value={title} placeholder="Title" />
                </DialogTitle>
                <DialogContent className={color}>
                    <DialogContentText>
                        <TextField
                            multiline
                            rowsMax={20}
                            value={content}
                            placeholder="Content"
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions className={color}>
                    <Button color="primary" onClick={closeDialog}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Note;
