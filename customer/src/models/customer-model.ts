export interface CustomerEntity {
  customer_id: string;
  name: string;
  email: string;
}
export interface CreateCustomerDto {
  name: string;
  email: string;
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
