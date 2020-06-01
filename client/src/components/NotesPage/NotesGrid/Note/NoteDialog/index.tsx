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
    Close,
    LocalOffer as Tag,
    Share,
    AttachFile
} from "@material-ui/icons";
import clsx from "clsx";
import styles from "./NoteDialog.module.scss";
import ShareMenu from "./ShareMenu";
import NoteModel from "../../../../../models/Note";
import noteApi from "../../../../../apis/NoteAPI";
import PaletteMenu from "./PaletteMenu";
import { getEmailFromToken } from "../../../../../utils/TokenHandler";
import AttachmentsDialog from "./AttachmentsDialog";
import { useTranslation } from "react-i18next";

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
        [anchorShare, setAnchorShare] = React.useState<null | HTMLElement>(
            null
        ),
        [anchorPalette, setAnchorPalette] = React.useState<null | HTMLElement>(
            null
        ),
        [tagOpen, setTagOpen] = React.useState(false),
        [attachOpen, setAttachOpen] = React.useState(false),
        [newTag, setNewTag] = React.useState(""),
        { t } = useTranslation();

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

    const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) =>
        setAnchorShare(event.currentTarget);

    const handlePaletteClick = (event: React.MouseEvent<HTMLButtonElement>) =>
        setAnchorPalette(event.currentTarget);

    const handleClose = () => {
        setAnchorShare(null);
        setAnchorPalette(null);
    };

    const openTagDialog = () => setTagOpen(true);

    const closeTagDialog = () => setTagOpen(false);

    const openAttachmentsDialog = () => setAttachOpen(true);

    const closeAttachmentsDialog = () => setAttachOpen(false);

    const handleNewTagChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setNewTag(event.target.value);

    const checkTag = () => {
        return !props.note.tags?.includes(newTag);
    };

    const addTag = () => {
        if (!props.note.tags) return;

        closeTagDialog();

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
                            <IconButton onClick={openTagDialog}>
                                <Tag />
                            </IconButton>
                            <IconButton onClick={handlePaletteClick}>
                                <Palette />
                            </IconButton>
                            <IconButton
                                id="attachments"
                                onClick={openAttachmentsDialog}
                            >
                                <AttachFile />
                            </IconButton>
                            <IconButton onClick={deleteNote}>
                                <Delete />
                            </IconButton>
                            <IconButton onClick={handleShareClick}>
                                <Share />
                            </IconButton>
                        </div>
                    </div>
                </Hidden>
                <div style={{ display: "flex" }}>
                    <Input
                        value={props.note.title}
                        placeholder={t("notes.card.title")}
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
                            <IconButton id="local" onClick={openTagDialog}>
                                <Tag />
                            </IconButton>
                            <IconButton
                                id="palette"
                                onClick={handlePaletteClick}
                            >
                                <Palette />
                            </IconButton>
                            <IconButton
                                id="attachments"
                                onClick={openAttachmentsDialog}
                            >
                                <AttachFile />
                            </IconButton>
                            <IconButton id="delete" onClick={deleteNote}>
                                <Delete />
                            </IconButton>
                            <IconButton
                                id="moreVert"
                                onClick={handleShareClick}
                            >
                                <Share />
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
                <ShareMenu
                    handleClose={handleClose}
                    anchorEl={anchorShare}
                    handleNoteChange={props.handleNoteChange}
                    note={props.note}
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
                    placeholder={t("notes.card.content")}
                    onChange={handleContentChange}
                />
            </DialogContent>
            {props.note.tags && props.note.tags.length > 0 && (
                <DialogActions
                    className={clsx(
                        styles.dialogActions,
                        theme.palette.type || "light",
                        props.note.color?.toLowerCase()
                    )}
                >
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
                </DialogActions>
            )}
            <AttachmentsDialog
                open={attachOpen}
                handleClose={closeAttachmentsDialog}
                handleNoteChange={props.handleNoteChange}
                note={props.note}
            />
            <Dialog open={tagOpen} onClose={closeTagDialog}>
                <DialogTitle>{t("notes.card.newTag")}</DialogTitle>
                <DialogContent>
                    <TextField
                        value={newTag}
                        variant="filled"
                        label={t("notes.card.tag")}
                        onChange={handleNewTagChange}
                        error={!checkTag()}
                        helperText={
                            !checkTag() ? t("notes.card.tagExists") : ""
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeTagDialog}>
                        {t("notes.card.close")}
                    </Button>
                    <Button
                        color="primary"
                        onClick={addTag}
                        disabled={newTag.length === 0 || !checkTag()}
                    >
                        {t("notes.card.add")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default NoteDialog;
