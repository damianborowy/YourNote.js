import React from "react";
import NoteModel from "../../../models/Note";
import { Grid, Typography, useTheme } from "@material-ui/core";
import Note from "../Note";
import styles from "./NotesGrid.module.scss";

interface INotesGridProps {
    notes: NoteModel[];
    deleteNoteFromList: (note: NoteModel) => void;
    name: string;
}

const NotesGrid = (props: INotesGridProps) => {
    const theme = useTheme();
    console.log(theme);
    return (
        <>
            {props.notes.length != 0 && (
                <div className={styles.container}>
                    <Typography
                        variant="h6"
                        style={{ color: theme.palette.text.primary }}
                        className={styles.typography}
                    >
                        {props.name}
                    </Typography>
                    <Grid container spacing={1}>
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
                    </Grid>
                </div>
            )}
        </>
    );
};

export default NotesGrid;
