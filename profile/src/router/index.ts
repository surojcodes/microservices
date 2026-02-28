import express from "express";
import { CreateProfile, getProfile, getProfiles } from "../controllers";

const profileRouter = express.Router();

profileRouter.route("/").get(getProfiles).post(CreateProfile);
profileRouter.route("/:id").get(getProfile);

export default profileRouter;
