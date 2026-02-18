import { AccountType, Customer } from "../generated/generated-types";
import {
  AccountDto,
  AccountInternal,
  CustomerDto,
} from "../types/api-response-types";

export const accountMapper = (source: AccountDto): AccountInternal => {
  return {
    accountNumber: source.accountNumber,
    balance: source.balance,
    accountType: source.accountType as unknown as AccountType,
    customerId: source.customerId,
  };
};

export const customerMapper = (source: CustomerDto): Customer => {
  return {
    customerId: source.id,
    email: source.email,
    name: source.name,
  };
};
