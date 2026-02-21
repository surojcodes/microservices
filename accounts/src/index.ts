import express from "express";
import { configDotenv } from "dotenv";
import accountRouter from "./routes";

configDotenv();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use("/accounts", accountRouter);

app.listen(PORT, () => {
  console.log(`ACCOUNT_API Listening on ${PORT}`);
});
