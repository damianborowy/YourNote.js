import express, { Request, Response, NextFunction } from "express";

var router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("It's working!");
});

export default router;
