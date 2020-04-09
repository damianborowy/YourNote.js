import React from "react";
import NoteModel from "../../../models/Note";
import noteApi from "../../../apis/NoteAPI";
import Card from "./Card";
import NoteDialog from "./NoteDialog";

interface INoteProps {
    model: NoteModel;
    deleteNoteFromList: (note: NoteModel) => void;
}

const Note = ({ model, deleteNoteFromList }: INoteProps) => {
    const note = { ...model },
        [open, setOpen] = React.useState(note.wasJustCreated || false),
        [title, setTitle] = React.useState(note.title),
        [content, setContent] = React.useState(note.content);

    const openDialog = () => setOpen(true);
    const closeDialog = () => setOpen(false);

    const updateNote = async () => await noteApi.update(note);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const title = event.target.value;
        setTitle(title);
        note.title = title;
        updateNote();
    };

    const handleContentChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const content = event.target.value;
        setContent(content);
        note.content = content;
        updateNote();
    };

    return (
        <>
            <Card openDialog={openDialog} title={title} content={content} />
            <NoteDialog
                open={open}
                title={title}
                content={content}
                handleTitleChange={handleTitleChange}
                handleContentChange={handleContentChange}
                closeDialog={closeDialog}
                note={note}
                deleteNoteFromList={deleteNoteFromList}
                updateNote={updateNote}
            />
        </>
    );
};

export default Note;
