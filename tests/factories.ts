import prisma from "config/database"
import { faker } from '@faker-js/faker';

export function createConsole() {
    return prisma.console.create({
        data: {
          name: faker.lorem.word()
        }
    })
};

export function createGame(consoleId: number) {
    return prisma.game.create({
        data: {
            title: faker.random.words(),
            consoleId
        }
    })
}