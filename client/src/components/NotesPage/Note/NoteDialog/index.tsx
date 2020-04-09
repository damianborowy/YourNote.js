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
import LinkShareDialog from "./LinkShareDialog";
import UserShareDialog from "./UserShareDialog";

interface INoteDialogProps {
    color: string;
    open: boolean;
    title: string | undefined;
    content: string | undefined;
    handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleContentChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    closeDialog: () => void;
    note: NoteModel;
    deleteNoteFromList: (note: NoteModel) => void;
    updateNote: () => void;
}

const NoteDialog = (props: INoteDialogProps) => {
    const theme = useTheme(),
        fullScreen = useMediaQuery(theme.breakpoints.down("xs")),
        [subDialogOpen, setSubDialogOpen] = React.useState(false),
        [subToUserDialogOpen, setSubToUserDialogOpen] = React.useState(false),
        [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null),
        [subAnchorEl, setSubAnchorEl] = React.useState<null | HTMLElement>(
            null
        );

    const deleteNote = async () => {
        const { note } = props;

        if (!note._id) return;

        const result = await noteApi.delete(note._id);

        if (!result) return;

        props.deleteNoteFromList(note);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
        setAnchorEl(event.currentTarget);

    const handleClose = () => {
        subHandleClose();
        setAnchorEl(null);
    };

    const subHandleClick = (event: React.MouseEvent<HTMLLIElement>) =>
        setSubAnchorEl(event.currentTarget);

    const subHandleClose = () => setSubAnchorEl(null);

    const subShareDialogOpen = () => {
        handleClose();
        setSubDialogOpen(true);
    };

    const subShareDialogClose = () => {
        setSubDialogOpen(false);
    };

    const subShareToUserDialogOpen = () => {
        handleClose();
        setSubToUserDialogOpen(true);
    };

    const subShareToUserDialogClose = () => {
        setSubToUserDialogOpen(false);
    };

    return (
        <>
            <Dialog
                fullWidth
                open={props.open}
                fullScreen={fullScreen}
                onClose={props.closeDialog}
            >
                <DialogTitle className={clsx(props.color, styles.dialogTitle)}>
                    <Hidden smUp>
                        <div style={{ display: "flex" }}>
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
                            value={props.title}
                            placeholder="Title"
                            className={styles.dialogTitleText}
                            onChange={props.handleTitleChange}
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
                                <IconButton onClick={handleClick}>
                                    <MoreVert />
                                </IconButton>
                                <IconButton onClick={props.closeDialog}>
                                    <Close />
                                </IconButton>
                            </div>
                        </Hidden>
                    </div>
                    <Menu
                        subHandleClose={subHandleClose}
                        subHandleClick={subHandleClick}
                        handleClose={handleClose}
                        subShareDialogOpen={subShareDialogOpen}
                        subShareToUserDialogOpen={subShareToUserDialogOpen}
                        anchorEl={anchorEl}
                        subAnchorEl={subAnchorEl}
                    />
                </DialogTitle>
                <DialogContent
                    className={clsx(props.color, styles.dialogContent)}
                >
                    <TextField
                        multiline
                        rowsMax={20}
                        value={props.content}
                        placeholder="Content"
                        onChange={props.handleContentChange}
                        fullWidth
                    />
                </DialogContent>
            </Dialog>
            <LinkShareDialog
                note={props.note}
                updateNote={props.updateNote}
                subDialogOpen={subDialogOpen}
                subShareDialogClose={subShareDialogClose}
            />
            <UserShareDialog
                subShareToUserDialogClose={subShareToUserDialogClose}
                subToUserDialogOpen={subToUserDialogOpen}
            />
        </>
    );
};

export default NoteDialog;
