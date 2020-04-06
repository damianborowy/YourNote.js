import app from "../src/app";
import supertest from "supertest";

const request = supertest(app);

describe("Environmental variables", () => {
    it("Check if MONGODB_CONNECTION_STRING is present", () => {
        const connectionString = process.env.MONGODB_CONNECTION_STRING;

        expect(connectionString).toBeDefined();
    });

    it("Check if JWT_SECRET is present", () => {
        const secret = process.env.JWT_SECRET;

        expect(secret).toBeDefined();
    });

    it("Check if TESTING_TOKEN is present", () => {
        const token = process.env.TESTING_TOKEN;

        expect(token).toBeDefined();
    });
});

describe("Testing endpoints", () => {
    describe("Testing without authentication token", () => {
        it("GET the /notes endpoint without token and fail", async (done) => {
            const result = await request.get("/notes");

            expect(result.status).toBe(401);
            done();
        });
    });

    // describe("Testing with authentication token", () => {
    //     const headers = {
    //         Authorization: `Bearer ${process.env.TESTING_TOKEN}`,
    //         "Content-Type": "application/json"
    //     };

    //     it("GET the /notes endpoint with token and succeed", async (done) => {
    //         const result = await request.get("/notes").set(headers);

    //         console.log(result);
    //         expect(result.status).toBe(200);
    //         done();
    //     });
    // });
});
