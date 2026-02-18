import { AccountEntity, AccountType } from "../models/account-model";

export const generateAccountNumber = (
  accountType: string,
  accounts: AccountEntity[],
): string => {
  return "apple";
};

export const isValidAccountType = (accountType: any) => {
  return Object.values(AccountType).includes(accountType);
};
