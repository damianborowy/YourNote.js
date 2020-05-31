import React, { useEffect, useState } from "react";
import styles from "./SharedNotePage.module.scss";
import { useParams, Link } from "react-router-dom";
import noteApi from "../apis/NoteAPI";
import NoteModel from "../models/Note";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    DialogActions,
    Button
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import _ from "lodash";
import { useTranslation } from "react-i18next";

const SharedNotesPage = () => {
    const { noteId } = useParams();
    const [note, setNote] = useState<null | NoteModel>(null),
        { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            const result = await noteApi.readPublicNote(noteId!);

            console.log(result);

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
                        <DialogActions>
                            <Link to={"/"} style={{ textDecoration: "none" }}>
                                <Button>{t("sharedNote.back")}</Button>
                            </Link>
                        </DialogActions>
                    </div>
                ) : (
                    <Alert className={styles.alert} severity="error">
                        <AlertTitle>{t("sharedNote.error")}</AlertTitle>
                        <Typography>{t("sharedNote.errorText")}</Typography>
                        <Link to={"/"}>
                            <Typography>{t("sharedNote.back")}</Typography>
                        </Link>
                    </Alert>
                )}
            </Dialog>
        </div>
    );
};

export default SharedNotesPage;
