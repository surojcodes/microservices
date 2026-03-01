import argon2 from "argon2";
import jwt, { SignOptions } from "jsonwebtoken";
import { JwtClaims } from "../models";

export const hashPassword = async (password: string) => {
  return await argon2.hash(password, {
    type: argon2.argon2id, // important
  });
};

export const isValidPassword = async (hash: string, password: string) => {
  return await argon2.verify(hash, password);
};

export const signJWT = (payload: JwtClaims) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "1h",
    issuer: "bank-api",
    audience: "bank-users",
  };
  return jwt.sign(payload, process.env.JWT_SECRET!, options);
};
