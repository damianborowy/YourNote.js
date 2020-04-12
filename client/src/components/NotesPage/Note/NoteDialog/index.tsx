import React from "react";
import {
    Dialog,
    DialogTitle,
    IconButton,
    Hidden,
    useMediaQuery,
    useTheme,
    Input,
    DialogContent,
    TextField
} from "@material-ui/core";
import {
    ArrowBack,
    Delete,
    Palette,
    MoreVert,
    Close
} from "@material-ui/icons";
import clsx from "clsx";
import styles from "./NoteDialog.module.scss";
import Menu from "./Menu";
import NoteModel from "../../../../models/Note";
import noteApi from "../../../../apis/NoteAPI";
import PaletteMenu from "./PaletteMenu";

interface INoteDialogProps {
    open: boolean;
    closeDialog: () => void;
    note: NoteModel;
    deleteNoteFromList: (note: NoteModel) => void;
    handleNoteChange: (note: NoteModel) => void;
}

const NoteDialog = (props: INoteDialogProps) => {
    const theme = useTheme(),
        fullScreen = useMediaQuery(theme.breakpoints.down("xs")),
        [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null),
        [subAnchorEl, setSubAnchorEl] = React.useState<null | HTMLElement>(
            null
        ),
        [anchorPalette, setAnchorPalette] = React.useState<null | HTMLElement>(
            null
        );

    const deleteNote = async () => {
        const { note } = props;
        if (!note._id) return;

        const result = await noteApi.delete(note._id);
        if (!result) return;

        props.deleteNoteFromList(note);
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newNote = { ...props.note };
        newNote.title = event.target.value;

        props.handleNoteChange(newNote);
    };

    const handleContentChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newNote = { ...props.note };
        newNote.content = event.target.value;

        props.handleNoteChange(newNote);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
        setAnchorEl(event.currentTarget);

    const handlePaletteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorPalette(event.currentTarget);
    };

    const handleClose = () => {
        subHandleClose();
        setAnchorEl(null);
        setAnchorPalette(null);
    };

    const subHandleClick = (event: React.MouseEvent<HTMLLIElement>) =>
        setSubAnchorEl(event.currentTarget);

    const subHandleClose = () => setSubAnchorEl(null);

    return (
        <>
            <Dialog
                fullWidth
                open={props.open}
                fullScreen={fullScreen}
                onClose={props.closeDialog}
            >
                <DialogTitle
                    className={clsx(
                        styles.dialogTitle,
                        theme.palette.type || "light",
                        props.note.color?.toLowerCase()
                    )}
                >
                    <Hidden smUp>
                        <div className={styles.hiddenMobile}>
                            <IconButton
                                className={styles.back}
                                onClick={props.closeDialog}
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
                                <IconButton onClick={handleClick}>
                                    <MoreVert />
                                </IconButton>
                            </div>
                        </div>
                    </Hidden>
                    <div style={{ display: "flex" }}>
                        <Input
                            value={props.note.title}
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
                                <IconButton onClick={handlePaletteClick}>
                                    <Palette />
                                </IconButton>
                                <IconButton onClick={deleteNote}>
                                    <Delete />
                                </IconButton>
                                <IconButton onClick={handleClick}>
                                    <MoreVert />
                                </IconButton>
                                <IconButton onClick={props.closeDialog}>
                                    <Close />
                                </IconButton>
                            </div>
                        </Hidden>
                    </div>
                    <PaletteMenu
                        handleClose={handleClose}
                        anchorEl={anchorPalette}
                        handleNoteChange={props.handleNoteChange}
                        note={props.note}
                    />

                    <Menu
                        subHandleClose={subHandleClose}
                        subHandleClick={subHandleClick}
                        handleClose={handleClose}
                        anchorEl={anchorEl}
                        subAnchorEl={subAnchorEl}
                        note={props.note}
                        handleNoteChange={props.handleNoteChange}
                    />
                </DialogTitle>
                <DialogContent
                    className={clsx(
                        styles.dialogContent,
                        theme.palette.type || "light",
                        props.note.color?.toLowerCase()
                    )}
                >
                    <TextField
                        fullWidth
                        multiline
                        rowsMax={20}
                        value={props.note.content}
                        placeholder="Content"
                        onChange={handleContentChange}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default NoteDialog;
