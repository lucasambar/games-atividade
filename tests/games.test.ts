import app from "app";
import supertest from "supertest";

const server = supertest(app);

describe("health", () => {
    it("should respond with 200 to health",async () => {
        const response = await server.get("/health")
        expect(response.status).toEqual(200)
    })
})