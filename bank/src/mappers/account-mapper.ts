import { Account } from "../generated/generated-types";
import { AccountDto } from "../types/api-response-types";

export const accountsMapper = (source: AccountDto): Account => {
  return {
    accountNumber: source.accountNumber,
    balance: source.balance,
    type: source.type,
  };
};
