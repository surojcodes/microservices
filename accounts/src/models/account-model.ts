export interface AccountEntity {
  account_number: string;
  customer_id: string;
  accountType: AccountType;
  balance: number;
}

export interface CreateAccountDto {
  customerId: string;
  accountType: AccountType;
  balance: number;
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
export enum AccountType {
  SAVINGS = "SAVINGS",
  CHECKING = "CHECKING",
}
