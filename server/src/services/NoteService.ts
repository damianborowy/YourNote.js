import Note, { INote } from "../models/Note";

import ICrudRepository from "./interfaces/ICrudRepository";
import { Types } from "mongoose";

export default class NoteService implements ICrudRepository<INote> {
    async read(id?: Types.ObjectId | undefined): Promise<INote[]> {
        if (id) {
            return this.getAllUserNotes(id);
        } else {
            throw new Error("Note Read Error");
        }
    }

    async create(obj: INote): Promise<INote> {
        return this.createNote(obj);
    }

    async update(obj: INote): Promise<INote> {
        return this.updateNote(obj);
    }

    async delete(id: Types.ObjectId): Promise<boolean> {
        return this.deleteNote(id);
    }

    //#region privateMethods

    private async getAllUserNotes(id: Types.ObjectId): Promise<INote[]> {
        let idString = id.toHexString.toString();

        let userNotes = await Note.find({
            sharedTo: idString,
            ownerId: idString
        });

        return userNotes;
    }

    private async createNote(note: INote): Promise<INote> {
        let createdNote = await Note.create(note);

        return createdNote;
    }

    private async updateNote(note: INote): Promise<INote> {
        let updatedNote = await Note.update({ _id: note._id }, note);

        return updatedNote;
    }

    private async deleteNote(id: Types.ObjectId): Promise<boolean> {
        let result = false;

        await Note.deleteOne({ _id: id }, err => {
            if (!err) result = true;
        });

        return result;
    }

    //#endregion
}
