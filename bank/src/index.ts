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
import logger from "./logger";
import PinoHttp from "pino-http";
import { register } from "./metrics";
import { metricsMiddleware } from "./middleware/metrics";

const app = express();

const PORT = process.env.PORT;
const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer<BankServiceContext>({
  schema,
});

app.use(metricsMiddleware);
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
app.use("/", healthRouter);
app.use(PinoHttp(logger));

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
    logger.info(`
      Express Server running at localhost:${PORT}
      Graphql Server running at localhost:${PORT}/bank
      `);
  });
}

startExpressServer();
