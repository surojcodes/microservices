import "dotenv/config";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import typeDefs from "./schemas/schema";
import resolvers from "./resolvers/resolvers";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { authenticateRequest } from "./middleware/auth";
import { BankServiceContext } from "./types/bank-api-types";
import cookieParser from "cookie-parser";
import healthRouter from "./router/health";

const app = express();

const PORT = process.env.PORT;
const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer<BankServiceContext>({
  schema,
});

app.use("/", healthRouter);

async function startExpressServer() {
  await apolloServer.start();
  app.use(
    "/bank",
    express.json(),
    cookieParser(),
    authenticateRequest,
    expressMiddleware(apolloServer, {
      context: async ({ req }): Promise<BankServiceContext> => {
        return {
          user: req.user,
          authorization: req.headers["authorization"] || "",
        };
      },
    }),
  );
  app.listen(PORT, () => {
    console.log(`
      Express Server running at localhost:${PORT}
      Graphql Server running at localhost:${PORT}/bank
      `);
  });
}

startExpressServer();
