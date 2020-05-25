import React, { useEffect } from "react";
import NoteModel from "../../../../models/Note";
import noteApi from "../../../../apis/NoteAPI";
import Card from "./Card";
import NoteDialog from "./NoteDialog";
import "./Note.scss";
import ViewModel from "../../../../models/View";

const WAIT_INTERVAL = 1000;

interface INoteProps {
    model: NoteModel;
    originalNotes: NoteModel[];
    setOriginalNotes: (note: NoteModel[]) => void;
    deleteNoteFromList: (note: NoteModel) => void;
    views: ViewModel[] | null;
    setViews: (views: ViewModel[]) => void;
    selectedView: ViewModel | null;
    setSelectedView: (selectedView: ViewModel) => void;
}

const Note = (props: INoteProps) => {
    const [note, setNote] = React.useState<NoteModel>(props.model),
        [open, setOpen] = React.useState(note.wasJustCreated || false);

    const openDialog = () => setOpen(true);

    const closeDialog = () => {
        if (note.wasJustCreated) note.wasJustCreated = false;

        setOpen(false);

        const originalNoteIndex = props.originalNotes.findIndex(
            (originalNote) => originalNote._id === note._id
        );

        const originalNotesCopy = [...props.originalNotes];
        originalNotesCopy[originalNoteIndex] = note;

        props.setOriginalNotes(originalNotesCopy);
    };

    const handleNoteChange = (changedNote: NoteModel) => setNote(changedNote);

    useEffect(() => {
        (async () => {
            await noteApi.update(note);
        })();
    }, [note]);

    return (
        <>
            <Card
                openDialog={openDialog}
                note={note}
                handleNoteChange={handleNoteChange}
                views={props.views}
                setViews={props.setViews}
                selectedView={props.selectedView}
                setSelectedView={props.setSelectedView}
            />
            <NoteDialog
                open={open}
                closeDialog={closeDialog}
                note={note}
                deleteNoteFromList={props.deleteNoteFromList}
                handleNoteChange={handleNoteChange}
            />
        </>
    );
};

export default Note;
