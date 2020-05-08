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
    TextField,
    DialogActions,
    Chip,
    Button
} from "@material-ui/core";
import {
    ArrowBack,
    Delete,
    Palette,
    MoreVert,
    Close,
    LocalOffer
} from "@material-ui/icons";
import clsx from "clsx";
import styles from "./NoteDialog.module.scss";
import Menu from "./Menu";
import NoteModel from "../../../../../models/Note";
import noteApi from "../../../../../apis/NoteAPI";
import PaletteMenu from "./PaletteMenu";
import { getEmailFromToken } from "../../../../../utils/TokenHandler";

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
        ),
        [open, setOpen] = React.useState(false),
        [newTag, setNewTag] = React.useState("");

    const deleteNote = async () => {
        const { note } = props;
        if (!note._id) return;

        const userEmail = getEmailFromToken();

        if (note.owner === userEmail) {
            const result = await noteApi.delete(note._id);
            if (!result.success) return;
        } else {
            const newNote = { ...note };
            const index = newNote.sharedTo?.findIndex(
                (email) => email === userEmail
            );
            newNote.sharedTo?.splice(index!, 1);
            const result = await noteApi.update(newNote);
            if (!result.success) return;
        }

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

    const handlePaletteClick = (event: React.MouseEvent<HTMLButtonElement>) =>
        setAnchorPalette(event.currentTarget);

    const handleClose = () => {
        subHandleClose();
        setAnchorEl(null);
        setAnchorPalette(null);
    };

    const subHandleClick = (event: React.MouseEvent<HTMLLIElement>) =>
        setSubAnchorEl(event.currentTarget);

    const subHandleClose = () => setSubAnchorEl(null);

    const openDialog = () => setOpen(true);

    const closeDialog = () => setOpen(false);

    const handleNewTagChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setNewTag(event.target.value);

    const checkTag = () => {
        return !props.note.tags?.includes(newTag);
    };

    const addTag = () => {
        if (!props.note.tags) return;

        closeDialog();

        const newNote = { ...props.note };

        newNote.tags!.push(newTag);

        setNewTag("");

        props.handleNoteChange(newNote);
    };

    const deleteTag = (deletedTag: string) => {
        if (props.note.tags && props.note.tags.length > 0) {
            const tagIndex = props.note.tags.findIndex(
                (tag) => tag === deletedTag
            );

            const newNote = { ...props.note };

            newNote.tags!.splice(tagIndex, 1);

            props.handleNoteChange(newNote);
        }
    };

    return (
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
                            <IconButton onClick={openDialog}>
                                <LocalOffer />
                            </IconButton>
                            <IconButton onClick={handlePaletteClick}>
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
                            <IconButton id="local" onClick={openDialog}>
                                <LocalOffer />
                            </IconButton>
                            <IconButton
                                id="palette"
                                onClick={handlePaletteClick}
                            >
                                <Palette />
                            </IconButton>
                            <IconButton id="delete" onClick={deleteNote}>
                                <Delete />
                            </IconButton>
                            <IconButton id="moreVert" onClick={handleClick}>
                                <MoreVert />
                            </IconButton>
                            <IconButton id="close" onClick={props.closeDialog}>
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
            {((props.note.tags && props.note.tags.length > 0) ||
                props.note.files.length > 0) && (
                <DialogActions
                    className={clsx(
                        styles.dialogActions,
                        theme.palette.type || "light",
                        props.note.color?.toLowerCase()
                    )}
                >
                    {props.note.tags && props.note.tags.length > 0 && (
                        <div className={styles.dialogActionsRow}>
                            {props.note.tags.map((tag) => (
                                <Chip
                                    variant="outlined"
                                    label={`#${tag}`}
                                    onDelete={() => deleteTag(tag)}
                                    key={tag}
                                />
                            ))}
                        </div>
                    )}
                    {props.note.files.length > 0 && (
                        <div className={styles.dialogActionsRow}>
                            <h1>foo</h1>
                        </div>
                    )}
                </DialogActions>
            )}
            <Dialog open={open} onClose={closeDialog}>
                <DialogTitle>Add new tag</DialogTitle>
                <DialogContent>
                    <TextField
                        value={newTag}
                        variant="filled"
                        label="Tag"
                        onChange={handleNewTagChange}
                        error={!checkTag()}
                        helperText={!checkTag() ? "Tag already exists." : ""}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Close</Button>
                    <Button
                        color="primary"
                        onClick={addTag}
                        disabled={newTag.length === 0 || !checkTag()}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default NoteDialog;
