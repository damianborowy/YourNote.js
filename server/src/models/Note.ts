import moongose, { Schema, Document } from "mongoose";

export interface INote extends Document {
    title: string;
    content: string;
    color: number;
    tags: string;
    date: Date;
    ownerId: string;
    sharedTo: string[];
}

const NoteShema = new Schema({
    title: { type: String, required: false },
    content: { type: String, required: false },
    color: { type: Number, required: true },
    tags: { type: String, required: false },
    date: { type: Date, required: true },
    ownerId: { type: String, required: true },
    sharedTo: { type: [String], required: true }
});

const NoteModel = moongose.model<INote>("Notes", NoteShema);
export default NoteModel;
