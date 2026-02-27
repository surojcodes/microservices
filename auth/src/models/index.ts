export interface UserEntity {
  user_id: string;
  username: string;
  password: string;
  role: UserRole;
}

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
