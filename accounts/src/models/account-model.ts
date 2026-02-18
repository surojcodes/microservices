export interface AccountEntity {
  account_number: string;
  customer_id: string;
  type: string;
  balance: number;
}

export interface CreateAccountDto {
  customerId: string;
  type: string;
  balance: number;
}

export interface AccountDto {
  accountNumber: string;
  customerId: string;
  type: string;
  balance: number;
}

export interface AccountAPIRes {
  success: boolean;
  data?: AccountDto | AccountDto[];
  message?: string;
}
