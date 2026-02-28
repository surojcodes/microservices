import { Request, Response } from "express";
import { AuthAPIRes, createUserDto } from "../models";
import { validateRegisterInput } from "../utils/validation-utils";

export const login = (
  req: Request<never, never, createUserDto>,
  res: Response,
) => {
  res.json({ message: "Registered" });
};
export const register = (req: Request, res: Response) => {
  const createUserInput = req.body;
  const validationRes = validateRegisterInput(createUserInput);
  if (!validationRes.success) {
    return res.status(400).json({
      success: true,
      message: validationRes.message,
    });
  }
};
