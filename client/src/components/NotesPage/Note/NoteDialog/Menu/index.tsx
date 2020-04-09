import React from "react";
import { Menu as MaterialMenu, MenuItem } from "@material-ui/core";
import { Share, ArrowRight } from "@material-ui/icons";
import styles from "./Menu.module.scss";

interface IMenuProps {
    subHandleClose: () => void;
    subShareToUserDialogOpen: () => void;
    subShareDialogOpen: () => void;
    handleClose: () => void;
    subHandleClick: (event: React.MouseEvent<HTMLLIElement>) => void;
    anchorEl: null | HTMLElement;
    subAnchorEl: null | HTMLElement;
}

const Menu = (props: IMenuProps) => {
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
                <MenuItem onClick={props.subShareDialogOpen}>
                    <Share className={styles.share} />
                    By link
                </MenuItem>
                <MenuItem onClick={props.subShareToUserDialogOpen}>
                    <Share className={styles.share} />
                    To specified user
                </MenuItem>
            </MaterialMenu>
        </>
    );
};

export default Menu;
