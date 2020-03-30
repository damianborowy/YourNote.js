import ApiResponse from "./ApiResponse";
import Note from "../models/Note";
import { insertTokenAndHeaders } from "../utils/TokenHandler";

const noteApi = {
    async create(note?: Note) {
        const result = await fetch("http://localhost:5001/notes", {
            method: "POST",
            headers: insertTokenAndHeaders(),
            body: JSON.stringify(note)
        }).then(res => res.json());

        if (!result) return new ApiResponse(400);

        return new ApiResponse(200, result);
    },

    async read() {
        const result = await fetch("http://localhost:5001/notes", {
            headers: insertTokenAndHeaders()
        }).then(res => res.json());

        if (!result) return new ApiResponse(400);

        return new ApiResponse(200, result);
    },

    async update(note: Note) {
        const result = await fetch("http://localhost:5001/notes", {
            method: "PUT",
            headers: insertTokenAndHeaders(),
            body: JSON.stringify(note)
        }).then(res => res.json());

        if (!result) return new ApiResponse(400);

        return new ApiResponse(200, result);
    },

    async delete(noteId: string) {}
};

export default noteApi;
