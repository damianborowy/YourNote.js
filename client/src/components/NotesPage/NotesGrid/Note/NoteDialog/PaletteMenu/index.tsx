import React from "react";
import {
    Menu as MaterialMenu,
    MenuItem,
    Box,
    Typography,
    useTheme
} from "@material-ui/core";
import styles from "./PaletteMenu.module.scss";
import NoteModel from "../../../../../../models/Note";
import clsx from "clsx";

interface IPaletteMenuProps {
    handleClose: () => void;
    handleNoteChange: (note: NoteModel) => void;
    anchorEl: null | HTMLElement;
    note: NoteModel;
}

const colorTab = [
    "Transparent",
    "Red",
    "Green",
    "Blue",
    "Gray",
    "Yellow",
    "Orange"
];

const PaletteMenu = (props: IPaletteMenuProps) => {
    const theme = useTheme();

    const handlePickColor = (newColor: string) => {
        const newNote = { ...props.note };
        newNote.color = newColor.toUpperCase();
        props.handleNoteChange(newNote);
    };

    return (
        <>
            <MaterialMenu
                anchorEl={props.anchorEl}
                keepMounted
                open={Boolean(props.anchorEl)}
                onClose={props.handleClose}
            >
                {colorTab.map((color) => {
                    return (
                        <MenuItem
                            onClick={() => handlePickColor(color)}
                            key={color}
                        >
                            <Box
                                className={clsx(
                                    styles.box,
                                    theme.palette.type || "light",
                                    color.toLowerCase()
                                )}
                            ></Box>
                            <Typography>{color}</Typography>
                        </MenuItem>
                    );
                })}
            </MaterialMenu>
        </>
    );
};

export default PaletteMenu;
