import React from "react";
import NoteModel from "../../../models/Note";
import { Grid, Typography, useTheme } from "@material-ui/core";
import Note from "./Note";
import styles from "./NotesGrid.module.scss";
import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap,
    move
} from "react-grid-dnd";
import { getEmailFromToken } from "../../../utils/TokenHandler";

interface INotesGridProps {
    notes: NoteModel[];
    deleteNoteFromList: (note: NoteModel) => void;
    name: string;
    dndSetter: (notes: NoteModel[]) => void;
}

const NotesGrid = (props: INotesGridProps) => {
    const theme = useTheme();

    const handleDNDGridChange = (
        sourceId: string,
        sourceIndex: number,
        targetIndex: number,
        targetId: string | undefined
    ) => {
        const notesCopy = [...props.notes];
        const nextState = swap(notesCopy, sourceIndex, targetIndex);
        props.dndSetter(nextState);
    };
    const filterNotes = (notes: NoteModel[]) => {
        if (props.name === "My notes") {
            return notes.filter(note => note.owner === getEmailFromToken());
        } else {
            return notes.filter(note => note.owner !== getEmailFromToken());
        }
    };
    return (
        <>
            {props.notes.length !== 0 && (
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
                            boxesPerRow={4}
                            rowHeight={100}
                            style={{ height: "400px" }}
                        >
                            {filterNotes(props.notes).map(note => {
                                return (
                                    <GridItem key={note._id}>
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
                    {/* <Grid container spacing={1}>
                        {props.notes.map(note => {
                            return (
                                <Grid item xs={6} sm={4} md={3} key={note._id}>
                                    <Note
                                        model={note}
                                        deleteNoteFromList={
                                            props.deleteNoteFromList
                                        }
                                    />
                                </Grid>
                            );
                        })}
                    </Grid> */}
                </div>
            )}
        </>
    );
};

export default NotesGrid;
