export interface CreateAccountDto {
  userId: string;
  accountType: AccountType;
  balance: number;
  accountNickname?: string;
}

export interface AccountDto {
  accountNumber: number;
  userId: string;
  accountType: AccountType;
  balance: number;
  accountStatus: AccountStatus;
  createdAt: string;
  accountNickname: string;
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

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
