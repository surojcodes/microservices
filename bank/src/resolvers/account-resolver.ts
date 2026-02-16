import { URLS } from "../config";
import { Account, QueryAccountArgs } from "../generated/generated-types";
import axios from "axios";
import { AccountAPIRes, AccountDto } from "../types/api-response-types";
import { accountsMapper } from "../mappers/account-mapper";

const accounts = async (): Promise<Account[]> => {
  try {
    const { data: accountsResponse } = await axios.get<AccountAPIRes>(
      `${URLS.ACCOUNTS_API_URL}/accounts`,
    );
    if (accountsResponse.success) {
      const accounts = accountsResponse.data as AccountDto[];
      return accounts.map((account) => accountsMapper(account));
    } else {
      throw new Error();
    }
  } catch (ex) {
    throw new Error("Unable to fetch accounts");
  }
};
const account = async (
  _: never,
  args: QueryAccountArgs,
): Promise<Account | undefined> => {
  const accountResponse = await axios.get<AccountAPIRes>(
    `${URLS.ACCOUNTS_API_URL}/accounts/${args.accountNumber}`,
  );
  console.log(accountResponse.data);
  if (accountResponse.status === 404) return;
  const account = accountResponse.data;
  return accountsMapper(account.data as AccountDto);
};
export const AccountQuery = {
  accounts,
  account,
};
