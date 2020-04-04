import React from "react";
import styles from "./SharedNotePage.module.scss";
import { useParams } from "react-router-dom";

interface ISharedNotesPageProps {}

const SharedNotesPage = (props: ISharedNotesPageProps) => {
    const { noteId } = useParams();

    return <h1>{noteId}</h1>;
};

export default SharedNotesPage;
