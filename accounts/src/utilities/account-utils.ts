import { AccountEntity, AccountType } from "../models/account-model";

export const generateAccountNumber = (
  accountType: AccountType,
  accounts: AccountEntity[],
): string => {
  const checkingCount = accounts.filter(
    (account) => account.account_type === AccountType.CHECKING,
  ).length;
  const savingsCount = accounts.filter(
    (account) => account.account_type === AccountType.SAVINGS,
  ).length;
  switch (accountType) {
    case AccountType.CHECKING:
      return `CH_${checkingCount + 1}`;
    case AccountType.SAVINGS:
      return `SA_${savingsCount + 1}`;
    default:
      throw new Error("Invalid account type");
  }
};
