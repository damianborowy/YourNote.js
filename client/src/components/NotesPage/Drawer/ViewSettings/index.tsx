import React, { useState } from "react";
import styles from "./ViewSettings.module.scss";
import ViewModel from "../../../../models/View";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@material-ui/core";

interface IViewSettingsProps {
    open: boolean;
    clickedViewName: string;
    views: ViewModel[] | null;
    setViews: (views: ViewModel[]) => void;
    selectedView: ViewModel | null;
    setSelectedView: (view: ViewModel) => void;
    handleClose: () => void;
}

const ViewSettings = (props: IViewSettingsProps) => {
    const [newName, setNewName] = useState("");

    const handleViewDelete = () => {};

    const handleViewUpdate = () => {};

    return (
        <Dialog open={props.open} onClose={props.handleClose} fullWidth>
            <DialogTitle>Editing view {props.clickedViewName}</DialogTitle>
            <DialogContent className={styles.dialogContent}></DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={handleViewDelete}>
                    Delete
                </Button>
                <Button color="primary" onClick={handleViewUpdate}>
                    Save
                </Button>
                <Button>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewSettings;
