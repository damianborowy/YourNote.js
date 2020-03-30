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
