import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client.js";
import {
  PrismaClientInitializationError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "../generated/prisma/internal/prismaNamespace.js";

if (!process.env.APP_DATABASE_URL) {
  throw new Error("APP_DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString: process.env.APP_DATABASE_URL,
});
export const prisma = new PrismaClient({ adapter });

export function getPrismaErrorMessage(err: unknown): {
  status: number;
  message: string;
} {
  // Known request errors (most useful)
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        return {
          status: 409,
          message: `User with provided details already exists`,
        };
      }

      case "P2003":
        return {
          status: 400,
          message: "Invalid reference to related record",
        };

      case "P2025":
        return {
          status: 404,
          message: "Requested record not found",
        };

      case "P2000":
        return {
          status: 400,
          message: "One of the provided values is too long",
        };

      default:
        return {
          status: 400,
          message: `Database error (${err.code})`,
        };
    }
  }

  // Validation error (very common during dev)
  if (err instanceof PrismaClientValidationError) {
    return {
      status: 400,
      message: "Invalid data provided",
    };
  }

  // Initialization error
  if (err instanceof PrismaClientInitializationError) {
    return {
      status: 500,
      message: "Database connection failed",
    };
  }

  // Rust panic (rare but serious)
  if (err instanceof PrismaClientRustPanicError) {
    return {
      status: 500,
      message: "Database engine crashed",
    };
  }

  // Unknown request error
  if (err instanceof PrismaClientUnknownRequestError) {
    return {
      status: 500,
      message: "Unknown database error occurred",
    };
  }

  // Fallback
  return {
    status: 500,
    message: "Internal server error",
  };
}
