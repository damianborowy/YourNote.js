import ApiResponse from "./ApiResponse";
import Note from "../models/Note";
import { insertTokenAndHeaders } from "../utils/TokenHandler";

const noteApi = {
    async create(note: Note) {},

    async read() {
        const result = await fetch("http://localhost:5001/notes", {
            headers: insertTokenAndHeaders()
        });

        if (!result) return new ApiResponse(400);

        return new ApiResponse(200, result);
    },

    async update(note: Note) {},

    async delete(noteId: string) {}
};

export default noteApi;
