import React, { useEffect, useState } from "react";
import styles from "./SharedNotePage.module.scss";
import { useParams } from "react-router-dom";
import noteApi from "../apis/NoteAPI";
import NoteModel from "../models/Note";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import _ from "lodash";

const SharedNotesPage = () => {
    const { noteId } = useParams();
    const [note, setNote] = useState<null | NoteModel>(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await noteApi.readPublicNote(noteId!);

            if (_.isEmpty(result.payload)) return;

            setNote(result.payload);
        };

        fetchData();
    }, [noteId]);

    return (
        <div className={styles.container}>
            <Dialog fullWidth open>
                {note ? (
                    <div>
                        <DialogTitle>{note.title}</DialogTitle>
                        <DialogContent>
                            <Typography className={styles.typography}>
                                {note.content}
                            </Typography>
                        </DialogContent>
                    </div>
                ) : (
                    <Alert className={styles.alert} severity="error">
                        <AlertTitle>Error</AlertTitle>
                        You're trying to view a non-public or non-existing note
                    </Alert>
                )}
            </Dialog>
        </div>
    );
};

export default SharedNotesPage;
