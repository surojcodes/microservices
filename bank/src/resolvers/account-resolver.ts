import { URLS } from "../config";
import { Account, QueryAccountArgs } from "../generated/generated-types";
import axios from "axios";
import { AccountAPIRes, AccountDto } from "../types/api-response-types";
import { accountMapper } from "../mappers/mapper";

const accounts = async (): Promise<Account[]> => {
  try {
    const { data: accountsResponse } = await axios.get<AccountAPIRes>(
      URLS.ACCOUNTS_API_URL,
    );
    if (accountsResponse.success) {
      const accounts = accountsResponse.data as AccountDto[];
      return accounts.map((account) => accountMapper(account));
    } else {
      throw new Error();
    }
  } catch (ex) {
    throw new Error("Unable to fetch accounts :: " + ex.message);
  }
};
const account = async (
  _: never,
  args: QueryAccountArgs,
): Promise<Account | undefined> => {
  try {
    const accountResponse = await axios.get<AccountAPIRes>(
      `${URLS.ACCOUNTS_API_URL}/${args.accountNumber}`,
    );
    if (accountResponse.status === 404 || !accountResponse.data.success)
      throw new Error();
    const account = accountResponse.data;
    return accountMapper(account.data as AccountDto);
  } catch (ex) {
    throw new Error("Unable to fetch account :: " + ex.message);
  }
};
export const AccountQuery = {
  accounts,
  account,
};
