export interface ProfileEntity {
  user_id: string;
  name: string;
  email: string;
  dob: string;
  phone: string;
  address: string;
}
export interface CreateProfileDto {
  name: string;
  email: string;
  dob: string;
  phone: string;
  address: string;
}
export interface ProfileDto {
  id: string;
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
