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

interface ISharedNotesPageProps {}

const SharedNotesPage = (props: ISharedNotesPageProps) => {
    const { noteId } = useParams();
    const [note, setNote] = useState<NoteModel>({});

    useEffect(() => {
        const fetchData = async () => {
            const result = await noteApi.readPublicNote(noteId!);

            setNote(result.payload);
        };

        fetchData();
    }, []);

    return (
        <div className={styles.container}>
            <Dialog fullWidth open>
                <DialogTitle>{note.title}</DialogTitle>
                <DialogContent>
                    <Typography className={styles.typography}>
                        {note.content}
                    </Typography>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SharedNotesPage;
