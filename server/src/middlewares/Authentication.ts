import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const auth = (req: Request, res: Response, next: NextFunction) => {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error(
            "Environmental variable MONGODB_CONNECTION_STRING is not set."
        );

    const token = req.token;
    if (!token)
        return res.status(401).send("Authentication token wasn't provided.");

    try {
        jwt.verify(token, secret);
        next();
    } catch {
        return res
            .status(400)
            .send("Couldn't verify the authentication token.");
    }
};

export default auth;
