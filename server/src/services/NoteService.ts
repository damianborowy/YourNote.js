import Note, { INote } from "../models/Note";

import ICrudRepository from "./interfaces/ICrudRepository";
import { Types } from "mongoose";

export default class NoteService implements ICrudRepository<INote> {
    async read(id?: string | undefined): Promise<INote[]> {
        if (id) return this.getAllUserNotes(id);
        else throw new Error("Note Read Error");
    }

    async readNote(id: string): Promise<INote> {
        return this.getNote(id);
    }

    async create(obj: INote): Promise<INote> {
        return this.createNote(obj);
    }

    async update(obj: INote): Promise<INote> {
        return this.updateNote(obj);
    }

    async delete(id: string): Promise<boolean> {
        return this.deleteNote(id);
    }

    private async getAllUserNotes(id: string): Promise<INote[]> {
        const userNotes = await Note.find({ ownerId: id });

        return userNotes;
    }

    private async getNote(id: string): Promise<INote> {
        const note = await Note.findOne({ _id: id });

        if (!note) throw new Error("Couldn't find note with the given noteId");

        return note;
    }

    private async createNote(note: INote): Promise<INote> {
        let createdNote = await Note.create(note);

        return createdNote;
    }

    private async updateNote(note: INote): Promise<INote> {
        await Note.updateOne({ _id: note._id }, note);

        const result = await Note.findOne({ _id: note._id });

        if (!result)
            throw new Error("Couldn't find note with the given noteId");

        return result;
    }

    private async deleteNote(id: string): Promise<boolean> {
        let result = false;

        await Note.deleteOne({ _id: id }, (err) => {
            if (!err) result = true;
        });

        return result;
    }
}
