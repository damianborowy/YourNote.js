import { Request, Response } from "express";
import NoteService from "../services/NoteService";
import jwt from "jsonwebtoken";
import Note from "../models/Note";
import mongoose from "mongoose";

const noteService = new NoteService();

const noteController = {
    async create(req: Request, res: Response) {
        const token = jwt.decode(req.token!);
        // @ts-ignore
        const ownerId = token["_id"];

        const note = new Note({
            ownerId,
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
        const ownerId = token["_id"];

        try {
            const result = await noteService.read(ownerId);
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
        const result = await noteService.delete(
            new mongoose.mongo.ObjectId(req.params.noteId)
        );

        result
            ? res.status(200).send("Successfully deleted note.")
            : res.status(400).send("Bad request");
    }
};

export default noteController;
