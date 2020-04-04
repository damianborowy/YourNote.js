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
    Input,
    Menu,
    MenuItem,
    Switch,
    FormControl,
    FormControlLabel,
    Link
} from "@material-ui/core";
import NoteModel from "../../models/Note";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import noteApi from "../../apis/NoteAPI";
import {
    ArrowRight,
    ArrowBack,
    Close,
    MoreVert,
    Delete,
    Palette,
    Share,
    FileCopy
} from "@material-ui/icons";
import CopyToClipboard from "react-copy-to-clipboard";

const env = process.env.NODE_ENV || "development";
const clientUrl =
    env === "development"
        ? "http://localhost:3000/notes/public/"
        : "https://yournote-client.herokuapp.com/notes/public/";

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
        [subDialogOpen, setSubDialogOpen] = React.useState(false),
        [checkedB, setCheckedB] = React.useState(note.isPublic || false),
        [title, setTitle] = React.useState(note.title),
        [content, setContent] = React.useState(note.content),
        [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null),
        [clipboard, setClipboard] = React.useState(""),
        [subAnchorEl, setsubAnchorEl] = React.useState<null | HTMLElement>(
            null
        ),
        color = note.color ? pickColorClass(note.color) : "",
        theme = useTheme(),
        fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

    const openDialog = () => setOpen(true);
    const closeDialog = () => setOpen(false);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleChange = () => {
        setCheckedB(!checkedB);
        note.isPublic = !checkedB;
        updateNote();
    };
    const handleClose = () => {
        subHandleClose();
        setAnchorEl(null);
    };

    const subHandleClick = (event: React.MouseEvent<HTMLLIElement>) => {
        setsubAnchorEl(event.currentTarget);
    };

    const subHandleClose = () => {
        setsubAnchorEl(null);
    };

    const subShareDialogOpen = () => {
        handleClose();
        setSubDialogOpen(true);
    };
    const copyToClipboard = (myLink: string) => {
        setClipboard(myLink);
    };
    const subShareDialogClose = () => setSubDialogOpen(false);

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
                                <IconButton onClick={handleClick}>
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
                                <IconButton onClick={handleClick}>
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
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={subHandleClick}>
                        Share
                        <ArrowRight />
                    </MenuItem>
                </Menu>

                <Menu
                    id="simple-menu2"
                    anchorEl={subAnchorEl}
                    keepMounted
                    open={Boolean(subAnchorEl)}
                    onClose={subHandleClose}
                >
                    <MenuItem onClick={subShareDialogOpen}>
                        <Share className={styles.share} />
                        By link
                    </MenuItem>
                    <MenuItem onClick={subHandleClose}>
                        <Share className={styles.share} />
                        To specified user
                    </MenuItem>
                </Menu>
            </Dialog>
            <Dialog
                fullWidth
                open={subDialogOpen}
                fullScreen={fullScreen}
                onClose={subShareDialogClose}
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
                        <Typography>
                            <Link
                                className={styles.links}
                                href={clientUrl + note._id}
                            >
                                {clientUrl + note._id}
                            </Link>
                            <CopyToClipboard text={clientUrl + note._id}>
                                <IconButton>
                                    <FileCopy />
                                </IconButton>
                            </CopyToClipboard>
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={subShareDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Note;
