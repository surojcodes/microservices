import express from "express";
import { configDotenv } from "dotenv";
import customerRouter from "./router";

const app = express();

configDotenv();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/customers", customerRouter);

app.listen(PORT, () => {
  console.log(`CUSTOMER_API Listening on ${PORT}`);
});
