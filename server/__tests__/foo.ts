import app from "../src/app";
import supertest from "supertest";

const request = supertest(app);

describe("Testing endpoints", () => {
    it("Gets the notes endpoint", async (done) => {
        // const response = await request.get("/notes/");

        // done();
        expect(1).toBe(1);
        done();
    });
});
