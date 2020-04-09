import { Request, Response } from "express";
import NoteService from "../services/NoteService";
import jwt from "jsonwebtoken";
import Note from "../models/Note";
import mongoose from "mongoose";

const ObjectId = mongoose.mongo.ObjectId;
const noteService = new NoteService();

const noteController = {
    async create(req: Request, res: Response) {
        const token = jwt.decode(req.token!);
        // @ts-ignore
        const owner = token["email"];

        const note = new Note({
            owner,
            title: req.body.title,
            content: req.body.content,
            color: req.body.color
        });

        try {
            const result = await noteService.create(note);
            res.status(200).send(result);
        } catch (e) {
            res.status(400).send(e);
        }
    },

    async read(req: Request, res: Response) {
        const token = jwt.decode(req.token!);
        // @ts-ignore
        const owner = token["email"];

        try {
            const result = await noteService.read(owner);
            res.status(200).send(result);
        } catch (e) {
            res.status(400).send(e);
        }
    },

    async update(req: Request, res: Response) {
        try {
            const result = await noteService.update(req.body);
            res.status(200).send(result);
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
    }
};

export default noteController;
