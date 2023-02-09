import { faker } from "@faker-js/faker";
import app from "app";
import supertest from "supertest";
import { createConsole, createGame } from "./factories";
import cleanDB from "./helpers";

const server = supertest(app);

beforeEach(async () => {
    await cleanDB();
  });
  
describe("health", () => {
    it("should respond with 200 to health",async () => {
        const response = await server.get("/health")
        expect(response.status).toEqual(200)
    })
})

describe("GET: /games", () => {
    it("should respond with empity array",async () => {
        const response = await server.get("/games")
        expect(response.body).toEqual([])
    })
    it("should respond with status 200 and correct body to success case",async () => {
        const console = await createConsole()
        const game = await createGame(console.id)

        const response = await server.get("/games")
        expect(response.body).toEqual(
            expect.arrayContaining([
                {
                    id: game.id,
                    title: game.title,
                    consoleId: game.consoleId,
                    Console: {
                        id: console.id,
                        name: console.name
                    }
                }
            ])
        )
    })
})

describe("GET: /games/:id", () => {
    it("should respond with status 404 when game dosen't exist",async () => {
        const response = await server.get("/games/1")
        expect(response.status).toEqual(404)
    })

    it("should respond with stauts 200 and correct body to success case",async () => {
        const console = await createConsole()
        const game = await createGame(console.id)

        const response = await server.get(`/games/${game.id}`)
        expect(response.status).toEqual(200)
        expect(response.body).toEqual({
            id: game.id,
            title: game.title,
            consoleId: console.id
        })
    })
})

describe("POST: /games", () => {
    it("should respond with 422 if there is no body sent",async () => {
        const response = await server.post("/games")
        expect(response.status).toEqual(422)
    })

    it("should respond with 422 if body sent is in wrong type",async () => {
        const response = await server.post("/games").send({
            title: 12,
            consoleId: "wer"
        })
        expect(response.status).toEqual(422)
    })

    it("should respond with 409 if game already exist in db",async () => {
        const console = await createConsole()
        const game = await createGame(console.id)

        const response = await server.post("/games").send({
            title: game.title,
            consoleId: game.consoleId
        })
        expect(response.status).toBe(409)
    })

    it("should respond with 409 if console dosen't exist in DB",async () => {
        const response = await server.post("/games").send({
            title: faker.commerce.productName(),
            consoleId: faker.random.numeric()
        })
        expect(response.status).toBe(409)
    })

    it("should respond with status 201 success case", async () => {
        const console = await createConsole()
        const response = await server.post("/games").send({
            title: faker.commerce.productName(),
            consoleId: console.id
        })
        expect(response.status).toBe(201)
    })
})