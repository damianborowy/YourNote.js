import React, { useState, useEffect } from "react";
import styles from "./ViewSettings.module.scss";
import ViewModel from "../../../../models/View";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

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
    const [newName, setNewName] = useState(""),
        { t } = useTranslation();

    useEffect(() => {
        setNewName(props.clickedViewName);
    }, [props.clickedViewName]);

    const handleViewDelete = () => {
        if (!props.selectedView || !props.views) return;

        if (props.selectedView.name === props.clickedViewName)
            props.setSelectedView(props.views[0]);

        const targetViewIndex = props.views.findIndex(
            (view) => view.name === props.clickedViewName
        );

        const newViews = [...props.views];
        newViews.splice(targetViewIndex, 1);

        props.setViews(newViews);
        props.handleClose();
    };

    const handleViewUpdate = () => {
        if (!props.views) return;

        const targetViewIndex = props.views.findIndex(
            (view) => view.name === props.clickedViewName
        );

        const newViews = [...props.views];
        newViews[targetViewIndex].name = newName;

        props.setViews(newViews);
        props.handleClose();
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setNewName(event.target.value);

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle>
                {t("notes.drawer.viewSettings.editing")} '
                {props.clickedViewName}'
            </DialogTitle>
            <DialogContent className={styles.dialogContent}>
                <TextField
                    label={t("notes.drawer.viewSettings.viewName")}
                    value={newName}
                    variant="filled"
                    onChange={handleNameChange}
                />
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={handleViewDelete}>
                    {t("notes.drawer.viewSettings.delete")}
                </Button>
                <Button color="primary" onClick={handleViewUpdate}>
                    {t("notes.drawer.viewSettings.update")}
                </Button>
                <Button onClick={props.handleClose}>
                    {t("notes.drawer.viewSettings.close")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewSettings;
