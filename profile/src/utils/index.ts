import { CreateProfileDto } from "../models";

export interface ValidationResponse {
  success: boolean;
  message?: string;
}
export const validateCreateProfile = (
  registerInput: CreateProfileDto,
): ValidationResponse => {
  if (
    !registerInput.name ||
    !registerInput.email ||
    !registerInput.dob ||
    !registerInput.phone ||
    !registerInput.address
  ) {
    return {
      success: false,
      message: "All fields (name, email, dob, phone, address) are required.",
    };
  }
  if (registerInput.name.length < 2 || registerInput.name.trim() === "") {
    return {
      success: false,
      message: "Name should be at least 2 characters long",
    };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerInput.email)) {
    return {
      success: false,
      message: "Email should be a valid email address",
    };
  }
  if (!/^\d{10}$/.test(registerInput.phone)) {
    return {
      success: false,
      message: "Phone should be a valid 10 digit number",
    };
  }
  if (isNaN(Date.parse(registerInput.dob))) {
    return {
      success: false,
      message: "DOB should be a valid date",
    };
  }
  if (registerInput.address.trim() === "") {
    return {
      success: false,
      message: "Address should not be empty",
    };
  }
  return { success: true };
};
