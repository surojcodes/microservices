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
