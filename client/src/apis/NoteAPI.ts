import ApiResponse from "./ApiResponse";
import Note from "../models/Note";
import { insertTokenAndHeaders } from "../utils/TokenHandler";

const env = process.env.NODE_ENV || "development";
const serverUrl =
    env === "development"
        ? "http://localhost:5001"
        : "https://yournote-server.herokuapp.com";

const noteApi = {
    async create(note?: Note) {
        const result = await fetch(`${serverUrl}/notes`, {
            method: "POST",
            headers: insertTokenAndHeaders(),
            body: JSON.stringify(note)
        }).then((res) => res.json());

        if (!result) return new ApiResponse(400);

        return new ApiResponse(200, result);
    },

    async read() {
        const result = await fetch(`${serverUrl}/notes`, {
            headers: insertTokenAndHeaders()
        }).then((res) => res.json());

        if (!result) return new ApiResponse(400);

        return new ApiResponse(200, result);
    },

    async readPublicNote(noteId: string) {
        const result = await fetch(`${serverUrl}/notes/public/${noteId}`);

        console.log(result);

        if (!result.ok) return new ApiResponse(400);

        return new ApiResponse(200, await result.json());
    },

    async update(note: Note) {
        const result = await fetch(`${serverUrl}/notes`, {
            method: "PUT",
            headers: insertTokenAndHeaders(),
            body: JSON.stringify(note)
        }).then((res) => res.json());

        if (!result) return new ApiResponse(400);

        return new ApiResponse(200, result);
    },

    async delete(noteId: string) {
        const result = await fetch(`${serverUrl}/notes/${noteId}`, {
            method: "DELETE",
            headers: insertTokenAndHeaders()
        }).then((res) => res.text());

        if (!result) return new ApiResponse(400);

        return new ApiResponse(200, result);
    },

    async detach(noteId: string, fileName: string) {
        const result = await fetch(`${serverUrl}/notes/detach`, {
            method: "PATCH",
            headers: insertTokenAndHeaders(),
            body: JSON.stringify({ noteId, fileName })
        }).then((res) => res.json());

        if (!result) return new ApiResponse(400);

        return new ApiResponse(200, result);
    }
};

export default noteApi;
