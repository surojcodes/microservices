import { JwtClaims } from "./types";

declare global {
  namespace Express {
    interface Request {
      user?: JwtClaims | string; // depends on what you store in JWT
    }
  }
}
