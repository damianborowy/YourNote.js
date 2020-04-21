import jwt from "jsonwebtoken";

export function extractToken(): string {
    const token = localStorage.getItem("jwt");

    if (!token) return "";

    return token;
}

export function saveToken(token: string): void {
    localStorage.setItem("jwt", token);
}

export function removeToken(): void {
    localStorage.removeItem("jwt");
}

export function isTokenPresent(): boolean {
    const token = localStorage.getItem("jwt");

    return token ? true : false;
}

export function insertTokenAndHeaders() {
    const token = extractToken();

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
}

export function getEmailFromToken() {
    const decodedToken = jwt.decode(extractToken());
    if (!decodedToken || typeof decodedToken !== "object") return "";

    const email: string = decodedToken.email;

    return email ?? "";
}
