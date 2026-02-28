export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface createUserDto {
  username: string;
  password: string;
}

export interface AuthAPIRes {
  success: boolean;
  data?: string;
  message?: string;
}
