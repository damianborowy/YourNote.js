import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const admin = (req: Request, res: Response, next: NextFunction) => {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error(
            "Environmental variable MONGODB_CONNECTION_STRING is not set."
        );

    const token = jwt.decode(req.token!);
    if (!token)
        return res.status(401).send("Authentication token wasn't provided.");

    // @ts-ignore
    const role = token["role"];

    if (role === "Admin") next();
    else return res.status(403).send("You don't have access to this method.");
};
