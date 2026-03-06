import express from "express";
import { getProfile, getProfiles } from "../controllers";
import { adminOnly, authenticateRequest } from "../middleware/auth";

const profileRouter = express.Router();

profileRouter.route("/").get(authenticateRequest, adminOnly, getProfiles);
profileRouter.route("/:id").get(authenticateRequest, getProfile);

export default profileRouter;
