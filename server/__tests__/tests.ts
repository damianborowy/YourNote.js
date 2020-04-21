import app from "../src/app";
import supertest from "supertest";
import Note from "../src/models/Note";

const {
    connect,
    clearDatabase,
    closeDatabase,
    inputDefaultData
} = require("../testUtils/dbHandler");

const request = supertest(app);

const headers = {
    Authorization: `Bearer ${process.env.TESTING_TOKEN}`,
    "Content-Type": "application/json"
};

beforeAll(async () => await connect());

beforeEach(async () => await inputDefaultData());

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe("Environmental variables", () => {
    it("Check if MONGODB_CONNECTION_STRING is set", () => {
        const connectionString = process.env.MONGODB_CONNECTION_STRING;

        expect(connectionString).toBeDefined();
    });

    it("Check if JWT_SECRET is set", () => {
        const secret = process.env.JWT_SECRET;

        expect(secret).toBeDefined();
    });

    it("Check if TESTING_TOKEN is set", () => {
        const token = process.env.TESTING_TOKEN;

        expect(token).toBeDefined();
    });

    it("Check if TESTING_EMAIL is set", () => {
        const email = process.env.TESTING_EMAIL;

        expect(email).toBeDefined();
    });

    it("Check if TESTING_PASSWORD is set", () => {
        const password = process.env.TESTING_PASSWORD;

        expect(password).toBeDefined();
    });
});

describe("Testing endpoints", () => {
    describe("/notes", () => {
        describe("Testing CRUD without authentication token", () => {
            it("GET the /notes endpoint and fail", () => {
                return request.get("/notes").expect(401);
            });

            it("POST the /notes endpoint and fail", () => {
                return request.post("/notes").expect(401);
            });

            it("PUT the /notes endpoint and fail", () => {
                return request.put("/notes").expect(401);
            });

            it("DELETE the /notes endpoint and fail", () => {
                return request.delete("/notes").expect(401);
            });
        });

        describe("Testing CRUD with authentication token", () => {
            it("GET and succeed", () => {
                return request.get("/notes").set(headers).expect(200);
            });

            it("POST and succeed", () => {
                return request.post("/notes").set(headers).expect(200);
            });

            it("PUT and succeed", async (done) => {
                const note = (await Note.find({}))[0];

                const response = await request
                    .put("/notes")
                    .set(headers)
                    .send(note);

                expect(response.status).toBe(200);
                done();
            });

            it("DELETE and succeed", async (done) => {
                const note = (await Note.find({}))[0];

                const response = await request
                    .delete(`/notes/${note._id}`)
                    .set(headers);

                expect(response.status).toBe(200);
                done();
            });
        });

        describe("Testing public notes", () => {
            it("GET a public note with a correct _id and succeed", async (done) => {
                const note = (await Note.find({}))[0];

                const response = await request.get(`/notes/public/${note._id}`);

                expect(response.status).toBe(200);
                done();
            });

            it("GET a non-public note with a correct _id and fail", async (done) => {
                const note = (await Note.find({}))[1];

                const response = await request.get(`/notes/public/${note._id}`);

                expect(response.status).toBe(401);
                done();
            });

            it("GET a note with an incorrect _id and fail", () => {
                return request.get("/notes/public/someRandomId").expect(400);
            });
        });

        describe("Testing email presence validation", () => {
            it("GET /isValidEmail endpoint with a proper email without authentication token and fail", () => {
                return request
                    .get(`/users/isValidEmail/${process.env.TESTING_EMAIL}`)
                    .expect(401);
            });

            it("GET /isValidEmail endpoint with a proper email with authentication token and succeed", () => {
                return request
                    .get(`/users/isValidEmail/${process.env.TESTING_EMAIL}`)
                    .set(headers)
                    .expect(200);
            });

            it("GET /isValidEmail endpoint with an improper email without authentication token and fail", () => {
                return request
                    .get("/users/isValidEmail/someRandomEmail")
                    .expect(401);
            });

            it("GET /isValidEmail endpoint with an improper email with authentication token and succeed", () => {
                return request
                    .get("/users/isValidEmail/someRandomEmail")
                    .set(headers)
                    .expect(400);
            });
        });
    });

    describe("/users", () => {
        it("POST /register endpoint to register a new user and succeed", () => {
            return request
                .post("/users/register")
                .send({
                    email: "someRandomEmail@foo.com",
                    password: "andSomeRandomPassword!"
                })
                .expect(200);
        });

        it("POST /register endpoint to register an already existing user and fail", () => {
            return request
                .post("/users/register")
                .send({
                    email: process.env.TESTING_EMAIL,
                    password: process.env.TESTING_PASSWORD
                })
                .expect(400);
        });

        it("POST /login endpoint with correct data and succeed", () => {
            return request
                .post("/users/login")
                .send({
                    email: process.env.TESTING_EMAIL,
                    password: process.env.TESTING_PASSWORD
                })
                .expect(200);
        });

        it("POST /login endpoint with incorrect data and fail", () => {
            return request
                .post("/users/login")
                .send({
                    email: "email",
                    password: "password"
                })
                .expect(400);
        });
    });
});
