import { Request, Response } from "express";
import NoteService from "../services/NoteService";
import jwt from "jsonwebtoken";
import Note from "../models/Note";
import _ from "lodash";
import { UploadedFile } from "express-fileupload";
import mkdirp from "mkdirp";
import fs from "fs-extra";
import User from "../models/User";

const noteService = new NoteService();

const noteController = {
    async create(req: Request, res: Response) {
        const token = jwt.decode(req.token!);
        // @ts-ignore
        const owner = token["email"];

        const newNote = new Note({
            owner,
            title: req.body.title,
            content: req.body.content,
            color: req.body.color
        });

        const user = await User.findOne({ email: owner });

        if (!user) return res.status(400).send("Invalid user");

        try {
            const note = await noteService.create(newNote);

            user.views[0].notes.push(note.id);
            await user.updateOne(user);

            res.status(200).send(note);
        } catch (e) {
            res.status(400).send(e);
        }
    },

    async read(req: Request, res: Response) {
        const token = jwt.decode(req.token!);
        // @ts-ignore
        const owner = token["email"];

        try {
            const notes = await noteService.read(owner);
            res.status(200).send(notes);
        } catch (e) {
            res.status(400).send(e);
        }
    },

    async update(req: Request, res: Response) {
        try {
            const note = await noteService.update(req.body);
            res.status(200).send(note);
        } catch (e) {
            res.status(400).send(e);
        }
    },

    async delete(req: Request, res: Response) {
        const noteId = req.params.noteId;

        const token = jwt.decode(req.token!);
        // @ts-ignore
        const owner = token["email"];

        const user = await User.findOne({ email: owner });

        if (!user) return res.status(400).send("Invalid user");

        const result = await noteService.delete(noteId);

        if (result) {
            for (let view of user.views) {
                const deletedNoteIndex = view.notes.findIndex(
                    (id) => id === noteId
                );
                view.notes.splice(deletedNoteIndex, 1);
            }

            await user.updateOne(user);
            res.status(200).send("Successfully deleted note.");
        } else {
            res.status(400).send("Bad request");
        }
    },

    async guestRead(req: Request, res: Response) {
        const noteId = req.params.noteId;

        try {
            const note = await noteService.readNote(noteId);

            if (note.isPublic) res.status(200).send(note);
            else res.status(401).send("You don't have access to this note");
        } catch (e) {
            res.status(400).send(e);
        }
    },

    async attach(req: Request, res: Response) {
        const { noteId } = req.body;
        const note = await Note.findOne({ _id: noteId });

        if (!note)
            return res
                .status(400)
                .send(
                    "Couldn't find a note you're trying to add attachment to"
                );

        try {
            if (!req.files) {
                return res.status(400).send("No file uploaded");
            } else {
                const file = req.files.file as UploadedFile;
                const path = `./public/attachments/${noteId}`;

                if (file.size >= 10 * 1024 * 1024)
                    return res
                        .status(400)
                        .send("File exceeds maximum size limit");

                if (note.files.includes(file.name))
                    return res
                        .status(400)
                        .send("File with the given name already exists.");

                await mkdirp(path);
                file.mv(`${path}/${file.name}`);

                res.status(file.truncated ? 400 : 200).send({
                    status: !file.truncated,
                    data: {
                        name: file.name,
                        mimetype: file.mimetype,
                        size: file.size
                    }
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    },

    async detach(req: Request, res: Response) {
        const { noteId, fileName } = req.body;
        const note = await Note.findOne({ _id: noteId });

        if (!note)
            return res
                .status(404)
                .send(
                    "Couldn't find a note you're trying to remove attachment from."
                );

        try {
            await fs.remove(`./public/attachments/${noteId}/${fileName}`);
            res.status(200).send("Attachment was removed successfully.");
        } catch (e) {
            res.status(400).send(e);
        }
    }
};

export default noteController;
