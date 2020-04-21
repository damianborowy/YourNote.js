import ApiResponse from "./ApiResponse";
import { saveToken } from "../utils/TokenHandler";
import { insertTokenAndHeaders } from "../utils/TokenHandler";

const env = process.env.NODE_ENV || "development";
const serverUrl =
    env === "development"
        ? "http://localhost:5001"
        : "https://yournote-server.herokuapp.com";

const userApi = {
    async register(email: string, password: string) {
        const response = await fetch(`${serverUrl}/users/register`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.status > 300)
            return new ApiResponse(response.status, await response.text());

        return new ApiResponse(
            response.status,
            `Successfuly registered user ${email}`
        );
    },

    async login(email: string, password: string) {
        const response = await fetch(`${serverUrl}/users/login`, {
            method: "POST",
            body: JSON.stringify({
                email,
                password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status > 300)
            return new ApiResponse(response.status, await response.text());

        const token = await response.text();

        if (!token) return new ApiResponse(500, "Something went wrong");

        saveToken(token);

        return new ApiResponse(response.status, "");
    },

    async checkIfEmailExists(email: string) {
        const response = await fetch(
            `${serverUrl}/users/isValidEmail/${email}`,
            {
                headers: insertTokenAndHeaders()
            }
        );
        if (response.status > 300)
            return new ApiResponse(response.status, await response.text());

        return new ApiResponse(
            response.status,
            `Successfuly found email ${email}`
        );
    }
};

export default userApi;
