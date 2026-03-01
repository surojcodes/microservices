import { RegisterUserInput } from "../models";

export interface ValidationResponse {
  success: boolean;
  message?: string;
}
export const validateRegisterInput = (
  registerInput: RegisterUserInput,
): ValidationResponse => {
  if (!registerInput) {
    return {
      success: false,
      message: "Request body is required",
    };
  }
  if (
    !registerInput.username ||
    !registerInput.password ||
    !registerInput.name ||
    !registerInput.email ||
    !registerInput.dob ||
    !registerInput.phone ||
    !registerInput.address
  ) {
    return {
      success: false,
      message:
        "All fields (username, password, name, email, dob, phone, address) are required to register",
    };
  }
  if (
    registerInput.name.trim().length === 0 ||
    registerInput.address.trim().length === 0 ||
    registerInput.username.trim().length === 0 ||
    registerInput.password.trim().length === 0 ||
    registerInput.phone.trim().length === 0 ||
    registerInput.email.trim().length === 0 ||
    registerInput.dob.trim().length === 0
  ) {
    return {
      success: false,
      message: "All fields must be non-empty",
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

  if (!/\S+@\S+\.\S+/.test(registerInput.email)) {
    return {
      success: false,
      message: "Invalid email format",
    };
  }

  if (isNaN(Date.parse(registerInput.dob))) {
    return {
      success: false,
      message: "Invalid date of birth format",
    };
  }

  if (!/^\d{10}$/.test(registerInput.phone)) {
    return {
      success: false,
      message: "Phone number should be 10 digits long",
    };
  }

  if (new Date(registerInput.dob) > new Date()) {
    return {
      success: false,
      message: "Date of birth cannot be in the future",
    };
  }
  return { success: true };
};
export const validateLoginInput = (loginInput: {
  username: string;
  password: string;
}): ValidationResponse => {
  if (!loginInput) {
    return {
      success: false,
      message: "Request body is required",
    };
  }
  if (!loginInput.username || !loginInput.password) {
    return {
      success: false,
      message: "Both username and password are required to login",
    };
  }
  if (
    loginInput.username.trim().length === 0 ||
    loginInput.password.trim().length === 0
  ) {
    return {
      success: false,
      message: "Username and password must be non-empty",
    };
  }
  return { success: true };
};
