import React, { useEffect, useState } from "react";
import styles from "./SharedNotePage.module.scss";
import { useParams } from "react-router-dom";
import noteApi from "../apis/NoteAPI";
import NoteModel from "../models/Note";

interface ISharedNotesPageProps {}

const SharedNotesPage = (props: ISharedNotesPageProps) => {
    const { noteId } = useParams();
    const [note, setNote] = useState<NoteModel>({});

    useEffect(() => {
        const fetchData = async () => {
            const result = await noteApi.readPublicNote(noteId!);

            console.log(result);

            setNote(result.payload);
        };

        fetchData();
    }, []);

    return <h1>{note._id}</h1>;
};

export default SharedNotesPage;
