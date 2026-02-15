import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";

const app = express();
const PORT = 4000;

const typeDefs = `#graphql 
type Query{
  account:String
}
`;

const resolvers = {
  Query: {
    account: () => "Accounts",
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
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
