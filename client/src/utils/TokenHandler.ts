export function extractToken() {
    const token = localStorage.getItem("jwt");

    return token;
}

export function saveToken(token: string) {
    localStorage.setItem("jwt", token);
}

export function removeToken() {
    localStorage.removeItem("jwt");
}

export function isTokenPresent() {
    const token = localStorage.getItem("jwt");

    return token ? true : false;
}
