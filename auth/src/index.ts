import "dotenv/config";
import express from "express";
import authRouter from "./router";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`AUTH_API listening on ${PORT}`);
});
