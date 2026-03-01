import express from "express";
import { getProfile, getProfiles } from "../controllers";

const profileRouter = express.Router();

profileRouter.route("/").get(getProfiles);
profileRouter.route("/:id").get(getProfile);

export default profileRouter;
