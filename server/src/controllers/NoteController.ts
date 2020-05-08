import { Request, Response } from "express";
import NoteService from "../services/NoteService";
import jwt from "jsonwebtoken";
import Note from "../models/Note";
import _ from "lodash";
import { UploadedFile } from "express-fileupload";
import mkdirp from "mkdirp";
import mongoose from "mongoose";

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

    async adminRead(req: Request, res: Response) {
        const email = req.params.email;

        try {
            const notes = await noteService.read(email);
            res.status(200).send(notes);
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

                await mkdirp(`./public/attachments/${noteId}`);
                file.mv(`./public/attachments/${noteId}/${file.name}`);

                note.files.push(file.name);
                await noteService.update(note);

                res.send({
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
    }
};

export default noteController;
