export interface AccountEntity {
  account_number: string;
  user_id: string;
  account_type: AccountType;
  balance: number;
  account_status: AccountStatus;
  created_at: string;
  account_nickname: string;
}

export interface CreateAccountDto {
  userId: string;
  accountType: AccountType;
  balance: number;
  accountNickname: string;
}

export interface AccountDto {
  accountNumber: string;
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
