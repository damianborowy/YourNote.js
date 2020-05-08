import React, { useState } from "react";
import NoteModel from "../../../../../../models/Note";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@material-ui/core";
import { Upload } from "antd";
import { Publish } from "@material-ui/icons";
import { fileUploadHeaders } from "../../../../../../utils/TokenHandler";
import { useStore } from "../../../../../DarkModeProvider";
import { UploadFile, UploadChangeParam } from "antd/lib/upload/interface";

const env = process.env.NODE_ENV || "development";
const serverUrl =
    env === "development"
        ? "http://localhost:5001"
        : "https://yournote-server.herokuapp.com";

interface IAttachmentsDialogProps {
    open: boolean;
    handleClose: () => void;
    handleNoteChange: (note: NoteModel) => void;
    note: NoteModel;
}

interface File {
    uid: string;
    name: string;
    status: "uploading" | "done" | "error" | "removed";
    url: string;
}

const _filesToList = (note: NoteModel): File[] => {
    return note.files.map((file, i) => {
        return {
            uid: i.toString(),
            name: file,
            status: "done",
            url: `${serverUrl}/attachments/${note._id}/${file}`
        };
    });
};

const AttachmentsDialog = ({
    open,
    handleClose,
    handleNoteChange,
    note
}: IAttachmentsDialogProps) => {
    const { darkMode } = useStore();

    darkMode
        ? require("antd/dist/antd.dark.css")
        : require("antd/dist/antd.css");

    const onChange = ({ file }: UploadChangeParam<UploadFile>) => {
        if (file.status !== "uploading") {
            const newNote = { ...note };

            newNote.files.push(file.name);

            handleNoteChange(newNote);
        }
    };

    const props = {
        action: `${serverUrl}/notes/attach`,
        data: { noteId: note._id },
        headers: fileUploadHeaders(),
        onChange
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Attachments</DialogTitle>
            <DialogContent>
                <Upload {...props}>
                    <Button startIcon={<Publish />}>Add new</Button>
                </Upload>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AttachmentsDialog;
