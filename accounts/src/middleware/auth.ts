import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { sub: string; username: string; role: string };
}

export const authenticateRequest = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
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
    return res.status(401).json({ success: false, message: "INVALID_TOKEN" });
  }
};
