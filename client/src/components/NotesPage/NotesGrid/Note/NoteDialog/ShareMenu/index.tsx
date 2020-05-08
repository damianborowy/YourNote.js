import React from "react";
import { Menu as MaterialMenu, MenuItem } from "@material-ui/core";
import { Share } from "@material-ui/icons";
import styles from "./Menu.module.scss";
import LinkShareDialog from "./LinkShareDialog";
import UserShareDialog from "./UserShareDialog";
import NoteModel from "../../../../../../models/Note";

interface IMenuProps {
    handleClose: () => void;
    handleNoteChange: (note: NoteModel) => void;
    anchorEl: null | HTMLElement;
    note: NoteModel;
}

const ShareMenu = (props: IMenuProps) => {
    const [dialogOpen, setDialogOpen] = React.useState(false),
        [toUserDialogOpen, setToUserDialogOpen] = React.useState(false);

    const shareDialogOpen = () => {
        props.handleClose();
        setDialogOpen(true);
    };

    const shareDialogClose = () => {
        setDialogOpen(false);
    };

    const shareToUserDialogOpen = () => {
        props.handleClose();
        setToUserDialogOpen(true);
    };

    const shareToUserDialogClose = () => {
        setToUserDialogOpen(false);
    };

    return (
        <>
            <MaterialMenu
                anchorEl={props.anchorEl}
                keepMounted
                open={Boolean(props.anchorEl)}
                onClose={props.handleClose}
            >
                <MenuItem id="byLink" onClick={shareDialogOpen}>
                    <Share className={styles.share} />
                    By link
                </MenuItem>
                <MenuItem id="shareToOtherUser" onClick={shareToUserDialogOpen}>
                    <Share className={styles.share} />
                    To specified user
                </MenuItem>
            </MaterialMenu>
            <LinkShareDialog
                note={props.note}
                subDialogOpen={dialogOpen}
                subShareDialogClose={shareDialogClose}
                handleNoteChange={props.handleNoteChange}
            />
            <UserShareDialog
                handleNoteChange={props.handleNoteChange}
                subShareToUserDialogClose={shareToUserDialogClose}
                subToUserDialogOpen={toUserDialogOpen}
                note={props.note}
            />
        </>
    );
};

export default ShareMenu;
