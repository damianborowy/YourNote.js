import moongose, { Schema, Document } from "mongoose";

export interface INote extends Document {
    title: string;
    content: string;
    color: number;
    tags: string;
    date: Date;
    ownerId: string;
    sharedTo: string[];
    isPublic: boolean;
}

const NoteShema = new Schema({
    title: { type: String, required: false },
    content: { type: String, required: false },
    color: { type: Number, required: true, default: 0 },
    tags: { type: String, required: false },
    date: { type: Date, required: true, default: Date.now() },
    ownerId: { type: String, required: true },
    sharedTo: { type: [String], required: false },
    isPublic: { type: Boolean, required: true, default: false }
});

export default moongose.model<INote>("Notes", NoteShema);
