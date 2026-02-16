import { Account, Customer } from "../generated/generated-types";
import { AccountDto, CustomerDto } from "../types/api-response-types";

export const accountMapper = (source: AccountDto): Account => {
  return {
    accountNumber: source.accountNumber,
    balance: source.balance,
    type: source.type,
  };
};

export const customerMapper = (source: CustomerDto): Customer => {
  return {
    customerId: source.id,
    email: source.email,
    name: source.name,
  };
};
