import app from "../src/app";
import supertest from "supertest";

const request = supertest(app);

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
});

describe("Testing endpoints", () => {
    describe("Testing without authentication token", () => {
        it("GET the /notes endpoint without token and fail", () => {
            return request.get("/notes").expect(401);
        });

        it("POST the /notes endpoint without token and fail", () => {
            return request.post("/notes").expect(401);
        });

        it("PUT the /notes endpoint without token and fail", () => {
            return request.put("/notes").expect(401);
        });

        it("DELETE the /notes endpoint without token and fail", () => {
            return request.delete("/notes").expect(401);
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
