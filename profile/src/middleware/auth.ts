import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../models";
import logger from "../logger";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { user_id: string; username: string; role: string };
}

export const authenticateRequest = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.error("Missing or malformed Authorization header");
    return res.status(401).json({ success: false, message: "UNAUTHORIZED" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as AuthenticatedRequest["user"];
    req.user = payload; // attach user info to req
    next();
  } catch (err) {
    logger.error(err, "Invalid JWT token");
    return res.status(401).json({ success: false, message: "INVALID_TOKEN" });
  }
};

export const adminOnly = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== UserRole.ADMIN) {
    logger.error(
      `User ${req.user?.user_id} with role ${req.user?.role} attempted to access admin-only route`,
    );
    return res.status(403).json({ success: false, message: "FORBIDDEN" });
  }
  next();
};
