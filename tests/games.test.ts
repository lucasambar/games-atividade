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