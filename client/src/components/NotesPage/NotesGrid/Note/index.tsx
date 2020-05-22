import React, { useEffect } from "react";
import NoteModel from "../../../../models/Note";
import noteApi from "../../../../apis/NoteAPI";
import Card from "./Card";
import NoteDialog from "./NoteDialog";
import "./Note.scss";

interface INoteProps {
    model: NoteModel;
    deleteNoteFromList: (note: NoteModel) => void;
}

const Note = ({ model, deleteNoteFromList }: INoteProps) => {
    const [note, setNote] = React.useState<NoteModel>(model),
        [open, setOpen] = React.useState(note.wasJustCreated || false);

    const openDialog = () => setOpen(true);

    const closeDialog = () => setOpen(false);

    const handleNoteChange = (note: NoteModel) => setNote(note);

    useEffect(() => {
        const updateNoteHelper = async () => {
            await noteApi.update(note);
        };

        updateNoteHelper();
    }, [note]);

    return (
        <>
            <Card
                openDialog={openDialog}
                note={note}
                handleNoteChange={handleNoteChange}
            />
            <NoteDialog
                open={open}
                closeDialog={closeDialog}
                note={note}
                deleteNoteFromList={deleteNoteFromList}
                handleNoteChange={handleNoteChange}
            />
        </>
    );
};

export default Note;
