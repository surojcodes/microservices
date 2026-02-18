import { Account } from "../generated/generated-types";
enum AccountType {
  SAVINGS = "SAVINGS",
  CHECKING = "CHECKING",
}

export interface AccountDto {
  accountNumber: string;
  customerId: string;
  accountType: AccountType;
  balance: number;
}
export interface AccountAPIRes {
  success: boolean;
  data?: AccountDto | AccountDto[];
  message?: string;
}
export interface CustomerDto {
  id: string;
  name: string;
  email: string;
}
export interface CustomerAPIRes {
  success: boolean;
  data?: CustomerDto | CustomerDto[];
  message?: string;
}
export interface AccountInternal extends Account {
  customerId: string;
}
