import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    firstName: string;
    allTags: string[];
    role: string;
}

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: false },
    allTags: { type: [String], required: false },
    role: {
        type: String,
        enum: ["User", "Admin"],
        required: false,
        default: "User"
    }
});

export default mongoose.model<IUser>("User", UserSchema);
