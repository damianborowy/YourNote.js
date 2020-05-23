import mongoose, { Schema, Document } from "mongoose";

export interface IView {
    name: string;
    notes: string[];
}

export interface IUser extends Document {
    email: string;
    password: string;
    role: string;
    views: IView[];
}

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["User", "Admin"],
        required: false,
        default: "User"
    },
    views: {
        type: [
            {
                name: String,
                notes: [String]
            }
        ],
        default: [{ name: "All notes", notes: [] }]
    }
});

export default mongoose.model<IUser>("User", UserSchema);
