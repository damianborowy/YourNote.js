import { Request, Response } from "express";
import NoteService from "../services/NoteService";
import jwt from "jsonwebtoken";
import Note from "../models/Note";
import _ from "lodash";
import { UploadedFile } from "express-fileupload";
import mkdirp from "mkdirp";
import fs from "fs-extra";

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

        try {
            const note = await noteService.create(newNote);
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
        const result = await noteService.delete(noteId);

        result
            ? res.status(200).send("Successfully deleted note.")
            : res.status(400).send("Bad request");
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
                res.send({
                    status: false,
                    message: "No file uploaded"
                });
            } else {
                const file = req.files.file as UploadedFile;
                const path = `./public/attachments/${noteId}`;

                if (note.files.includes(file.name))
                    return res
                        .status(400)
                        .send("File with the given name already exists.");

                await mkdirp(path);
                file.mv(`${path}/${file.name}`);

                note.files.push(file.name);
                await noteService.update(note);

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
                    "Couldn't find a note you're trying to remove attachment from"
                );

        const fileIndex = note.files.indexOf(fileName);
        note.files.splice(fileIndex, 1);

        await fs.remove(`./public/attachments/${noteId}/${fileName}`);

        try {
            const newNote = await noteService.update(note);
            res.status(200).send(newNote);
        } catch (e) {
            res.status(400).send(e);
        }
    }
};

export default noteController;
