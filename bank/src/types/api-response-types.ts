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
