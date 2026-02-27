import { Request, Response } from "express";

export const login = (req: Request, res: Response) => {
  res.json({ message: "Logged In" });
};
export const register = (req: Request, res: Response) => {
  res.json({ message: "Registered" });
};
