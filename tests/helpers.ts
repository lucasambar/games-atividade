import prisma from "config/database";

export default async function cleanDB() {
    await prisma.game.deleteMany({});
    await prisma.console.deleteMany({})
}