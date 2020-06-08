import Note, { INote } from "../models/Note";
import fs from "fs-extra";
import ICrudRepository from "./interfaces/ICrudRepository";
import _ from "lodash";
import mongoose from "mongoose";
import User from "../models/User";

export default class NoteService implements ICrudRepository<INote> {
    async read(email?: string | undefined): Promise<INote[]> {
        if (email) return this.getAllUserNotes(email);
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

    private async getAllUserNotes(email: string): Promise<INote[]> {
        const userNotes = await Note.find({ owner: email });
        const sharedNotes = await Note.find({ sharedTo: email });

        return [...userNotes, ...sharedNotes];
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
        await this.handleSharedToChange(note);

        const result = await Note.findOneAndUpdate({ _id: note._id }, note, {
            new: true
        });

        if (!result)
            throw new Error("Couldn't find note with the given noteId");

        return result;
    }

    private async deleteNote(id: string): Promise<boolean> {
        let result = false;

        await Note.deleteOne({ _id: id }, (err) => {
            if (!err) result = true;
        });

        await fs.remove(`./public/attachments/${id}`);

        return result;
    }

    private async handleSharedToChange(note: INote): Promise<void> {
        const id = mongoose.Types.ObjectId(note._id);
        const oldNote = await Note.findById(id);

        if (!oldNote)
            throw new Error("Couldn't find note with the given noteId");

        if (!_.isEqual(_.sortBy(oldNote.sharedTo), _.sortBy(note.sharedTo))) {
            const deletedUserEmail = _.difference(
                oldNote.sharedTo,
                note.sharedTo
            )[0];
            const newUserEmail = _.difference(
                note.sharedTo,
                oldNote.sharedTo
            )[0];

            if (deletedUserEmail) {
                const oldUser = await User.findOne({
                    email: deletedUserEmail
                });

                if (!oldUser)
                    throw new Error("Couldn't find user with the given email");

                oldUser.views.forEach((view) => {
                    const deletedNoteIndex = view.notes.indexOf(note._id);

                    view.notes.splice(deletedNoteIndex, 1);
                });

                await oldUser.update(oldUser);
            }

            if (newUserEmail) {
                const newUser = await User.findOne({ email: newUserEmail });

                if (!newUser)
                    throw new Error("Couldn't find user with the given email");

                newUser.views[0].notes.push(note._id);

                await newUser.update(newUser);
            }
        }
    }
}
