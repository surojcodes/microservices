import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import typeDefs from "./schemas/schema";
import resolvers from "./resolvers/resolvers";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { configDotenv } from "dotenv";

const app = express();

configDotenv();
const PORT = process.env.PORT;
const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({
  schema,
});

async function startExpressServer() {
  await apolloServer.start();
  app.use("/graphql", express.json(), expressMiddleware(apolloServer));
  app.listen(PORT, () => {
    console.log(`
      Express Server running at localhost:${PORT}
      Graphql Server running at localhost:${PORT}/graphql
      `);
  });
}

startExpressServer();
