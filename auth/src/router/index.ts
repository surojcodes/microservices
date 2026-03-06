import express from "express";
import { getUser, login, register } from "../controllers";
const authRouter = express.Router();

authRouter.route("/login").post(login);
authRouter.route("/register").post(register);
authRouter.route("/me").get(getUser);

export default authRouter;
