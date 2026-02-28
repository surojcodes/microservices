import { createUserDto } from "../models";

export interface ValidationResponse {
  success: boolean;
  message?: string;
}
export const validateRegisterInput = (
  registerInput: createUserDto,
): ValidationResponse => {
  if (!registerInput.username || !registerInput.password) {
    return {
      success: false,
      message: "Username and password are required to register",
    };
  }
  if (registerInput.username.length < 4) {
    return {
      success: false,
      message: "Username should be at least 4 characters long",
    };
  }
  if (registerInput.password.length < 4) {
    return {
      success: false,
      message: "Password should be at least 4 characters long",
    };
  }
  return { success: true };
};
