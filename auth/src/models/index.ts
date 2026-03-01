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
export interface LoginUserInput {
  username: string;
  password: string;
}
export interface JwtClaims {
  user_id: string;
  username: string;
  role: UserRole;
}
export interface AuthAPIRes {
  success: boolean;
  data?: unknown;
  message?: string;
}
