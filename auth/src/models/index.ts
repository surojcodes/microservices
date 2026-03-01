export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface RegisterUserInput {
  username: string;
  password: string;
  name: string;
  email: string;
  dob: string;
  phone: string;
  address: string;
}

export interface AuthAPIRes {
  success: boolean;
  data?: unknown;
  message?: string;
}
