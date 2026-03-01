import { Request, Response } from "express";
import { AuthAPIRes, RegisterUserInput } from "../models";
import { validateRegisterInput } from "../utils/validation-utils";
import { getPrismaErrorMessage, prisma } from "../utils/prisma";
import { hashPassword } from "../utils/auth-utils";

export const login = (req: Request, res: Response) => {
  res.json({ message: "Registered" });
};
export const register = async (
  req: Request<never, never, RegisterUserInput>,
  res: Response<AuthAPIRes>,
) => {
  const registerUserInput = req.body;
  const validationRes = validateRegisterInput(registerUserInput);
  if (!validationRes.success) {
    return res.status(400).json({
      success: false,
      message: validationRes.message,
    });
  }
  const { username, password, name, email, dob, phone, address } =
    registerUserInput;

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        password: await hashPassword(password),
        role: "USER",
        profile: {
          create: {
            name,
            email,
            dob,
            phone,
            address,
          },
        },
      },
      select: {
        user_id: true,
        username: true,
        role: true,
        profile: {
          select: {
            name: true,
            email: true,
            dob: true,
            phone: true,
            address: true,
          },
        },
      },
    });
    return res.json({
      success: true,
      data: newUser,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Error registering user:", err);
    const { status, message } = getPrismaErrorMessage(err);
    return res.status(status).json({
      success: false,
      message,
    });
  }
};
