import React from "react";
import { Menu as MaterialMenu, MenuItem } from "@material-ui/core";
import { Share, ArrowRight } from "@material-ui/icons";
import styles from "./Menu.module.scss";
import LinkShareDialog from "./LinkShareDialog";
import UserShareDialog from "./UserShareDialog";
import NoteModel from "../../../../../../models/Note";

interface IMenuProps {
    subHandleClose: () => void;
    handleClose: () => void;
    subHandleClick: (event: React.MouseEvent<HTMLLIElement>) => void;
    handleNoteChange: (note: NoteModel) => void;
    anchorEl: null | HTMLElement;
    subAnchorEl: null | HTMLElement;
    note: NoteModel;
}

const Menu = (props: IMenuProps) => {
    const [subDialogOpen, setSubDialogOpen] = React.useState(false),
        [subToUserDialogOpen, setSubToUserDialogOpen] = React.useState(false);

    const subShareDialogOpen = () => {
        props.handleClose();
        setSubDialogOpen(true);
    };

    const subShareDialogClose = () => {
        setSubDialogOpen(false);
    };

    const subShareToUserDialogOpen = () => {
        props.handleClose();
        setSubToUserDialogOpen(true);
    };

    const subShareToUserDialogClose = () => {
        setSubToUserDialogOpen(false);
    };

    return (
        <>
            <MaterialMenu
                anchorEl={props.anchorEl}
                keepMounted
                open={Boolean(props.anchorEl)}
                onClose={props.handleClose}
            >
                <MenuItem onClick={props.subHandleClick}>
                    Share
                    <ArrowRight />
                </MenuItem>
            </MaterialMenu>
            <MaterialMenu
                anchorEl={props.subAnchorEl}
                keepMounted
                open={Boolean(props.subAnchorEl)}
                onClose={props.subHandleClose}
            >
                <MenuItem onClick={subShareDialogOpen}>
                    <Share className={styles.share} />
                    By link
                </MenuItem>
                <MenuItem onClick={subShareToUserDialogOpen}>
                    <Share className={styles.share} />
                    To specified user
                </MenuItem>
            </MaterialMenu>
            <LinkShareDialog
                note={props.note}
                subDialogOpen={subDialogOpen}
                subShareDialogClose={subShareDialogClose}
                handleNoteChange={props.handleNoteChange}
            />
            <UserShareDialog
                handleNoteChange={props.handleNoteChange}
                subShareToUserDialogClose={subShareToUserDialogClose}
                subToUserDialogOpen={subToUserDialogOpen}
                note={props.note}
            />
        </>
    );
};

export default Menu;
