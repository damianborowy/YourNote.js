import app from "./app";
import mongoose, { mongo } from "mongoose";

const port = process.env.PORT || 5001;
app.set("port", port);

app.listen(port, () => {
    console.log(`App is running and listening on port ${port}.`);

    const connectionString = process.env.MONGODB_CONNECTION_STRING;

    if (!connectionString)
        throw new Error(
            "Environmental variable MONGODB_CONNECTION_STRING is not set."
        );

    mongoose
        .connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        .then(() => console.log("Successfully connected to database."))
        .catch((err) => console.error(err));
});
