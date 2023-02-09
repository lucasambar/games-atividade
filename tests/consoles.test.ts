import { faker } from "@faker-js/faker";
import app from "app";
import supertest from "supertest";
import { createConsole, createGame } from "./factories";
import cleanDB from "./helpers";

const server = supertest(app);

beforeEach(async () => {
    await cleanDB();
  });
  
describe("GET: /consoles", () => {
    it("should respond with empity array",async () => {
        const response = await server.get("/consoles")
        expect(response.body).toEqual([])
    })
    it("should respond with status 200 and correct body to success case",async () => {
        const console = await createConsole()

        const response = await server.get("/consoles")
        expect(response.body).toEqual(
            expect.arrayContaining([
                {
                   id: console.id,
                   name: console.name
                }
            ])
        )
    })
})

describe("GET: /consoles/:id", () => {
    it("should respond with status 404 when game dosen't exist",async () => {
        const response = await server.get("/consoles/1")
        expect(response.status).toEqual(404)
    })

    it("should respond with stauts 200 and correct body to success case",async () => {
        const console = await createConsole()

        const response = await server.get(`/consoles/${console.id}`)
        expect(response.status).toEqual(200)
        expect(response.body).toEqual({
            id: console.id,
            name: console.name,
        })
    })
})


describe("POST: /consoles", () => {
    it("should respond with 422 if there is no body sent",async () => {
        const response = await server.post("/consoles")
        expect(response.status).toEqual(422)
    })

    it("should respond with 422 if body sent is in wrong type",async () => {
        const response = await server.post("/consoles").send({
            name: 123
        })
        expect(response.status).toEqual(422)
    })

    it("should respond with 409 if game already exist in db",async () => {
        const console = await createConsole()

        const response = await server.post("/consoles").send({
            name: console.name
        })
        expect(response.status).toBe(409)
    })

    it("should respond with status 201 success case", async () => {
        const response = await server.post("/consoles").send({
            name: faker.commerce.productName()
        })
        expect(response.status).toBe(201)
    })
})