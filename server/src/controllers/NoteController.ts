import { Request, Response } from "express";
import NoteService from "../services/NoteService";

const noteService = new NoteService();

const noteController = {
    async create(req: Request, res: Response) {},

    async read(req: Request, res: Response) {
        res.status(200).send("OK");
    },

    async update(req: Request, res: Response) {},

    async delete(req: Request, res: Response) {}
};

export default noteController;
