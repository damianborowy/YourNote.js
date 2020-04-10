import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
    title: string;
    content: string;
    color: number;
    tags: string;
    date: Date;
    owner: string;
    sharedTo: string[];
    isPublic: boolean;
}

const NoteSchema = new Schema({
    title: { type: String, required: false },
    content: { type: String, required: false },
    color: {
        type: String,
        enum: [
            "TRANSPARENT",
            "BLUE",
            "GREEN",
            "RED",
            "GRAY",
            "YELLOW",
            "ORANGE"
        ],
        required: true,
        default: "TRANSPARENT"
    },
    tags: { type: String, required: false },
    date: { type: Date, required: true, default: Date.now() },
    owner: { type: String, required: true },
    sharedTo: { type: [String], required: false },
    isPublic: { type: Boolean, required: true, default: false }
});

export default mongoose.model<INote>("Notes", NoteSchema);
