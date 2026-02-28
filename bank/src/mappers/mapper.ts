import { AccountType, Profile } from "../generated/generated-types";
import {
  AccountDto,
  AccountInternal,
  ProfileDto,
} from "../types/api-response-types";

export const accountMapper = (source: AccountDto): AccountInternal => {
  return {
    accountNumber: source.accountNumber,
    balance: source.balance,
    accountType: source.accountType as unknown as AccountType,
    userId: source.userId,
  };
};

export const profileMapper = (source: ProfileDto): Profile => {
  return {
    userId: source.userId,
    email: source.email,
    name: source.name,
  };
};
