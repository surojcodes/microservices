import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

if (!process.env.APP_DATABASE_URL) {
  throw new Error("APP_DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString: process.env.APP_DATABASE_URL,
});
export const prisma = new PrismaClient({ adapter });
