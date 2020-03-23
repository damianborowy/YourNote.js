import express from "express";
import logger from "morgan";
import cors from "cors";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";

import indexRouter from "./routes/index";
import usersRouter from "./routes/Users";

// TODO:: enable dotenv.config() only in dev
dotenv.config();
const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

const port = process.env.PORT || 5000;
app.set("port", port);

app.listen(port, () => {
    console.log(`App is running and listening on port ${port}.`);

    const connectionString = process.env.MONGODB_CONNECTION_STRING;

    if (!connectionString)
        throw "Environmental variable MONGODB_CONNECTION_STRING is not set.";

    mongoose
        .connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        .then(() => console.log("Successfully connected to database."))
        .catch(err => console.error(err));
});
