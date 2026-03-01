import {
  AccountStatus,
  AccountType,
  Profile,
} from "../generated/generated-types";
import {
  AccountDto,
  AccountInternal,
  ProfileDto,
} from "../types/downstream-types";

export const accountMapper = (source: AccountDto): AccountInternal => {
  return {
    accountNumber: source.accountNumber,
    balance: source.balance,
    accountType: source.accountType as unknown as AccountType,
    userId: source.userId,
    accountNickname: source.accountNickname,
    accountStatus: source.accountStatus as unknown as AccountStatus,
    createdAt: source.createdAt,
  };
};

export const profileMapper = (source: ProfileDto): Profile => {
  return {
    userId: source.userId,
    email: source.email,
    name: source.name,
    phone: source.phone,
    dob: source.dob,
    address: source.address,
  };
};
