import ApiResponse from "./ApiResponse";
import { insertTokenAndHeaders } from "../utils/TokenHandler";
import User from "../models/User";

const env = process.env.NODE_ENV || "development";
const serverUrl =
    env === "development"
        ? "http://localhost:5001"
        : "https://yournote-server.herokuapp.com";

const adminApi = {
    async readAllUsers() {
        const result = await fetch(`${serverUrl}/users`, {
            headers: insertTokenAndHeaders()
        }).then((res) => res.json());

        if (!result) return new ApiResponse(400);

        return new ApiResponse(200, result);
    },

    async create(email: string, password: string) {
        const result = await fetch(`${serverUrl}/users`, {
            method: "POST",
            headers: insertTokenAndHeaders(),
            body: JSON.stringify({ email, password })
        }).then((res) => res.json());

        if (!result) return new ApiResponse(400);

        return new ApiResponse(200, result);
    },

    async update(user: User) {
        const result = await fetch(`${serverUrl}/users`, {
            method: "PUT",
            headers: insertTokenAndHeaders(),
            body: JSON.stringify(user)
        }).then((res) => res.text());

        if (!result) return new ApiResponse(400);

        return new ApiResponse(200, result);
    },

    async delete(email: string) {
        const result = await fetch(`${serverUrl}/users/${email}`, {
            method: "DELETE",
            headers: insertTokenAndHeaders()
        }).then((res) => res.text());

        if (!result) return new ApiResponse(400);

        return new ApiResponse(200, result);
    },

    async readAllNotes() {
        const result = await fetch(`${serverUrl}/notes/all`, {
            headers: insertTokenAndHeaders()
        }).then((res) => res.json());

        if (!result) return new ApiResponse(400);

        return new ApiResponse(200, result);
    }
};

export default adminApi;
