import express from "express";
import { getProfile, getProfiles } from "../controllers";
import { authenticateRequest } from "../middleware/auth";

const profileRouter = express.Router();

profileRouter.route("/").get(authenticateRequest, getProfiles);
profileRouter.route("/:id").get(authenticateRequest, getProfile);

export default profileRouter;
