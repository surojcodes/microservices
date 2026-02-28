import { Account } from "../generated/generated-types";
enum AccountType {
  Savings = "SAVINGS",
  Checking = "CHECKING",
}

export interface AccountDto {
  accountNumber: string;
  userId: string;
  accountType: AccountType;
  balance: number;
}
export interface AccountAPIRes {
  success: boolean;
  data?: AccountDto | AccountDto[];
  message?: string;
}
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
export interface AccountInternal extends Account {
  userId: string;
}
export interface CreateAccountDto {
  userId: string;
  accountType: AccountType;
  balance: number;
}

export interface CreateProfileDto {
  name: string;
  email: string;
  dob: string;
  phone: string;
  address: string;
}
