import express from "express";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import bearerToken from "express-bearer-token";

import usersRouter from "./routes/Users";
import notesRouter from "./routes/Notes";
import fileUpload from "express-fileupload";
import path from "path";

dotenv.config();
const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bearerToken());
app.use(express.static("public"));

app.use("/users", usersRouter);
app.use("/notes", notesRouter);

export default app;
