import express from "express";
import { configDotenv } from "dotenv";
import accountRouter from "./routes";
import healthRouter from "./routes/health";

configDotenv();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use("/accounts", accountRouter);
app.use("/", healthRouter);

app.listen(PORT, () => {
  console.log(`ACCOUNT_API is listening on PORT ${PORT}`);
});
