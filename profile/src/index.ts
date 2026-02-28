import express from "express";
import { configDotenv } from "dotenv";
import profileRouter from "./router";

const app = express();

configDotenv();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/profiles", profileRouter);

app.listen(PORT, () => {
  console.log(`PROFILE_API Listening on ${PORT}`);
});
