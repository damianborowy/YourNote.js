import ApiResponse from "./ApiResponse";
import { insertTokenAndHeaders } from "../utils/TokenHandler";
import View from "../models/View";

const env = process.env.NODE_ENV || "development";
const serverUrl =
    env === "development"
        ? "http://localhost:5001"
        : "https://yournote-server.herokuapp.com";

const viewApi = {
    async getViews() {
        const result = await fetch(`${serverUrl}/users/views`, {
            headers: insertTokenAndHeaders()
        }).then((res) => res.json());

        if (!result) return new ApiResponse(400);

        return new ApiResponse(200, result);
    },

    async updateViews(views: View[]) {
        const result = await fetch(`${serverUrl}/users/views`, {
            method: "PUT",
            headers: insertTokenAndHeaders(),
            body: JSON.stringify({ views })
        }).then((res) => res.json());

        if (!result) return new ApiResponse(400);

        return new ApiResponse(200, result);
    }
};

export default viewApi;
