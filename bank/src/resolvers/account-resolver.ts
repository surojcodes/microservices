import { URLS } from "../config";
import {
  Profile,
  MutationCreateAccountArgs,
  QueryAccountArgs,
} from "../generated/generated-types";
import axios, { AxiosResponse } from "axios";
import {
  AccountAPIRes,
  AccountDto,
  AccountInternal,
  CreateAccountDto,
  ProfileAPIRes,
  ProfileDto,
} from "../types/api-response-types";
import { accountMapper, profileMapper } from "../mappers/mapper";

//#region Queries
const accounts = async (): Promise<AccountInternal[]> => {
  try {
    const { data: accountsResponse } = await axios.get<AccountAPIRes>(
      URLS.ACCOUNT_API_URL,
    );
    if (accountsResponse.success) {
      const accounts = accountsResponse.data as AccountDto[];
      return accounts.map((account) => accountMapper(account));
    } else {
      throw new Error();
    }
  } catch (ex) {
    throw new Error(
      "Unable to fetch accounts :: " + ex.response?.data?.message || ex.message,
    );
  }
};
const account = async (
  _: never,
  args: QueryAccountArgs,
): Promise<AccountInternal | undefined> => {
  try {
    const accountResponse = await axios.get<AccountAPIRes>(
      `${URLS.ACCOUNT_API_URL}/${args.accountNumber}`,
    );
    if (accountResponse.status === 404 || !accountResponse.data.success)
      throw new Error();
    const account = accountResponse.data;
    return accountMapper(account.data as AccountDto);
  } catch (ex) {
    throw new Error("Unable to fetch account :: " + ex.message);
  }
};
const profile = async (account: AccountInternal): Promise<Profile> => {
  try {
    const profileResponse = await axios.get<ProfileAPIRes>(
      `${URLS.PROFILE_API_URL}/${account.userId}`,
    );
    if (profileResponse.status === 404 || !profileResponse.data.success)
      throw new Error();
    const profile = profileResponse.data;
    return profileMapper(profile.data as ProfileDto);
  } catch (ex) {
    throw new Error(
      "Unable to fetch profile :: " + ex.response?.data?.message || ex.message,
    );
  }
};
//#endregion

//#region Mutations
const createAccount = async (
  _: never,
  { input: { accountType, userId, balance } }: MutationCreateAccountArgs,
) => {
  try {
    const accountResponse = await axios.post<
      AccountAPIRes,
      AxiosResponse<AccountAPIRes>,
      CreateAccountDto
    >(URLS.ACCOUNT_API_URL, {
      accountType,
      userId,
      balance: balance ?? 0,
    });
    if (!accountResponse.data.success) throw new Error();
    const newAccount = accountResponse.data.data as AccountDto;
    return accountMapper(newAccount);
  } catch (ex) {
    throw new Error(
      "Unable to create account :: " + ex.response?.data?.message || ex.message,
    );
  }
};
//#endregion

export const AccountQuery = { accounts, account };
export const Account = { profile };
export const AccountMutation = { createAccount };
