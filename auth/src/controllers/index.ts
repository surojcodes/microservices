import { Request, Response } from "express";
import {
  AuthAPIRes,
  LoginUserInput,
  RegisterUserInput,
  UserRole,
} from "../models";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../utils/validation-utils";
import { getPrismaErrorMessage, prisma } from "../utils/prisma";
import { hashPassword, isValidPassword, signJWT } from "../utils/auth-utils";

export const login = async (
  req: Request<never, never, LoginUserInput>,
  res: Response<AuthAPIRes>,
) => {
  const loginInput = req.body;
  const validationRes = validateLoginInput(loginInput);
  if (!validationRes.success) {
    return res.status(400).json({
      success: false,
      message: validationRes.message,
    });
  }
  const { username, password } = loginInput;
  try {
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: {
        user_id: true,
        username: true,
        password: true,
        role: true,
      },
    });
    if (!user) {
      console.warn(`Login attempt with non-existent username: ${username}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await isValidPassword(user.password, password);
    if (!isPasswordValid) {
      console.warn(
        `Login attempt with invalid password for username: ${username}`,
      );
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const jwt = signJWT({
      user_id: user.user_id,
      username: user.username,
      role: user.role as UserRole,
    });
    res.cookie("token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parseInt(process.env.JWT_EXPIRES_IN_MS || "3600000"), // default 1 hour
    });

    return res.json({
      success: true,
      data: { user_id: user.user_id, token: jwt },
      message: "Login successful",
    });
  } catch (err) {
    console.error("Error logging in user:", err);
    const { status, message } = getPrismaErrorMessage(err);
    return res.status(status).json({
      success: false,
      message,
    });
  }
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
        username: username.toLowerCase(),
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
    const jwt = signJWT({
      user_id: newUser.user_id,
      username: newUser.username,
      role: newUser.role as UserRole,
    });
    res.cookie("token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parseInt(process.env.JWT_EXPIRES_IN_MS || "3600000"), // default 1 hour
    });
    return res.json({
      success: true,
      data: { ...newUser, token: jwt },
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
