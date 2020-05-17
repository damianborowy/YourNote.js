import React, { useState, useEffect } from "react";
import NoteModel from "../../../models/Note";
import { Typography, useTheme } from "@material-ui/core";
import Note from "./Note";
import styles from "./NotesGrid.module.scss";
import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap
} from "react-grid-dnd";
import { getEmailFromToken } from "../../../utils/TokenHandler";
import useWindowDimensions from "../../../utils/useWindowDimensions";

interface INotesGridProps {
    notes: NoteModel[];
    deleteNoteFromList: (note: NoteModel) => void;
    name: string;
    dndSetter: (notes: NoteModel[]) => void;
}

const NotesGrid = (props: INotesGridProps) => {
    const theme = useTheme(),
        [boxesPerRow, setBoxesPerRow] = useState(0),
        { width } = useWindowDimensions();

    useEffect(() => {
        let newBoxes = 1;

        if (width > 350) newBoxes++;
        if (width > 600) newBoxes++;
        if (width > 1000) newBoxes++;

        setBoxesPerRow(newBoxes);
    }, [width]);

    const handleDNDGridChange = (
        sourceId: string,
        sourceIndex: number,
        targetIndex: number,
        targetId?: string
    ) => {
        const notesCopy = [...props.notes];
        const nextState = swap(notesCopy, sourceIndex, targetIndex);
        props.dndSetter(nextState);
    };

    const filterNotes = (notes: NoteModel[]) => {
        if (props.name === "My notes") {
            return notes.filter((note) => note.owner === getEmailFromToken());
        } else {
            return notes.filter((note) => note.owner !== getEmailFromToken());
        }
    };

    return (
        <>
            {filterNotes(props.notes).length !== 0 && (
                <div id="note" className={styles.container}>
                    <Typography
                        variant="h6"
                        style={{ color: theme.palette.text.primary }}
                        className={styles.typography}
                    >
                        {props.name}
                    </Typography>
                    <GridContextProvider onChange={handleDNDGridChange}>
                        <GridDropZone
                            id="items"
                            boxesPerRow={boxesPerRow}
                            rowHeight={181}
                            style={{
                                height:
                                    181 *
                                    Math.ceil(props.notes.length / boxesPerRow)
                            }}
                        >
                            {filterNotes(props.notes).map((note) => {
                                return (
                                    <GridItem
                                        key={note._id}
                                        style={{
                                            padding: "0 3px"
                                        }}
                                    >
                                        <Note
                                            model={note}
                                            deleteNoteFromList={
                                                props.deleteNoteFromList
                                            }
                                        />
                                    </GridItem>
                                );
                            })}
                        </GridDropZone>
                    </GridContextProvider>
                </div>
            )}
        </>
    );
};

export default NotesGrid;
