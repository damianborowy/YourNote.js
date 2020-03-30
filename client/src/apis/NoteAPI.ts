import ApiResponse from "./ApiResponse";
import Note from "../models/Note";
import { extractToken } from "../utils/TokenHandler";

const noteApi = {
    async create(note: Note) {},

    async read() {},

    async update(note: Note) {},

    async delete(noteId: string) {}
};

export default noteApi;
