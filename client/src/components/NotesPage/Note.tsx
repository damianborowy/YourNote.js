import React from "react";
import styles from "./Note.module.scss";
import {
    Card,
    CardContent,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Hidden,
    IconButton,
    Input
} from "@material-ui/core";
import NoteModel from "../../models/Note";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import noteApi from "../../apis/NoteAPI";
import {
    ArrowBack,
    Close,
    MoreVert,
    Delete,
    Palette
} from "@material-ui/icons";

interface INoteProps {
    model: NoteModel;
    deleteNoteFromList: (note: NoteModel) => void;
}

const pickColorClass = (colorNum: number): string => {
    return styles.color;
};

const Note = ({ model, deleteNoteFromList }: INoteProps) => {
    const note = { ...model },
        [open, setOpen] = React.useState(note.wasJustCreated || false),
        [title, setTitle] = React.useState(note.title),
        [content, setContent] = React.useState(note.content),
        color = note.color ? pickColorClass(note.color) : "",
        theme = useTheme(),
        fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

    const openDialog = () => setOpen(true);
    const closeDialog = () => setOpen(false);

    const updateNote = async () => await noteApi.update(note);
    const deleteNote = async () => {
        if (!note._id) return console.log(note);

        const result = await noteApi.delete(note._id);

        if (!result) return; // TODO:: Handle error deleting error

        deleteNoteFromList(note);
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const title = event.target.value;
        setTitle(title);
        note.title = title;
        updateNote();
    };

    const handleContentChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const content = event.target.value;
        setContent(content);
        note.content = content;
        updateNote();
    };

    return (
        <>
            <Card
                className={clsx(styles.card)}
                variant="outlined"
                onClick={openDialog}
            >
                <CardContent className={styles.cardContent}>
                    <Typography
                        component="span"
                        variant="body1"
                        style={{ fontWeight: "bold" }}
                    >
                        {title}
                    </Typography>
                    <Typography>{content}</Typography>
                </CardContent>
            </Card>
            <Dialog
                fullWidth
                open={open}
                fullScreen={fullScreen}
                onClose={closeDialog}
            >
                <DialogTitle className={clsx(color, styles.dialogTitle)}>
                    <Hidden smUp>
                        <div style={{ display: "flex" }}>
                            <IconButton
                                className={styles.back}
                                onClick={closeDialog}
                            >
                                <ArrowBack />
                            </IconButton>
                            <div className={styles.dialogTitleMenu}>
                                <IconButton>
                                    <Palette />
                                </IconButton>
                                <IconButton onClick={deleteNote}>
                                    <Delete />
                                </IconButton>
                                <IconButton>
                                    <MoreVert />
                                </IconButton>
                            </div>
                        </div>
                    </Hidden>
                    <div style={{ display: "flex" }}>
                        <Input
                            value={title}
                            placeholder="Title"
                            className={styles.dialogTitleText}
                            onChange={handleTitleChange}
                            classes={{
                                input: styles.dialogTitleText
                            }}
                            fullWidth
                        />

                        <Hidden xsDown>
                            <div
                                className={clsx(
                                    styles.dialogTitleMenu,
                                    styles.dialogTitleMenuDesktop
                                )}
                            >
                                <IconButton>
                                    <Palette />
                                </IconButton>
                                <IconButton onClick={deleteNote}>
                                    <Delete />
                                </IconButton>
                                <IconButton>
                                    <MoreVert />
                                </IconButton>
                                <IconButton onClick={closeDialog}>
                                    <Close />
                                </IconButton>
                            </div>
                        </Hidden>
                    </div>
                </DialogTitle>
                <DialogContent className={clsx(color, styles.dialogContent)}>
                    <TextField
                        multiline
                        rowsMax={20}
                        value={content}
                        placeholder="Content"
                        onChange={handleContentChange}
                        fullWidth
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Note;
