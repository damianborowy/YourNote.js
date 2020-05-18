import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../src/models/User";
import Note from "../src/models/Note";
import bcryptjs from "bcryptjs";

const mongoMemoryServer = new MongoMemoryServer();

export async function connect() {
    const uri = await mongoMemoryServer.getConnectionString();

    const mongooseOpts = {
        useNewUrlParser: true,
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000
    };

    await mongoose.connect(uri, mongooseOpts);
}

export async function closeDatabase() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoMemoryServer.stop();
}

export async function clearDatabase() {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
}

export async function inputDefaultData() {
    const user = new User({
        email: process.env.TESTING_EMAIL,
        password: await bcryptjs.hash(process.env.TESTING_PASSWORD!, 10)
    });

    await user.save();

    const publicNote = new Note({
        owner: process.env.TESTING_EMAIL,
        isPublic: true,
        files: ["req.txt"]
    });

    await publicNote.save();

    const nonPublicNote = new Note({
        owner: process.env.TESTING_EMAIL
    });

    await nonPublicNote.save();
}
