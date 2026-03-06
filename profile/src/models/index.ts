export interface ProfileDto {
  userId: string;
  name: string;
  email: string;
  dob: string;
  phone: string;
  address: string;
}
export interface ProfileAPIRes {
  success: boolean;
  data?: ProfileDto | ProfileDto[];
  message?: string;
}
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}
