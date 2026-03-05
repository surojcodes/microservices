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
} from "../types/downstream-types";
import { accountMapper, profileMapper } from "../mappers/mapper";
import { BankServiceContext } from "../types/bank-api-types";
import { UserUtils } from "../utils/user-utils";

//#region Queries
const accounts = async (
  _: never,
  __: never,
  context: BankServiceContext,
): Promise<AccountInternal[]> => {
  try {
    const { data: accountsResponse } = await axios.get<AccountAPIRes>(
      URLS.ACCOUNT_API_URL,
      {
        headers: {
          authorization: context.authorization,
        },
      },
    );
    if (accountsResponse.success) {
      const accounts = accountsResponse.data as AccountDto[];
      return accounts.map((account) => accountMapper(account));
    } else {
      throw new Error();
    }
  } catch (ex) {
    console.error("Error fetching accounts:", ex); // Debug log
    throw new Error(
      "Unable to fetch accounts :: " + ex.response?.data?.message || ex.message,
    );
  }
};
const account = async (
  _: never,
  args: QueryAccountArgs,
  context: BankServiceContext,
): Promise<AccountInternal | undefined> => {
  try {
    const accountResponse = await axios.get<AccountAPIRes>(
      `${URLS.ACCOUNT_API_URL}/${args.accountNumber}`,
      {
        headers: {
          authorization: context.authorization,
        },
      },
    );
    if (accountResponse.status === 404 || !accountResponse.data.success)
      throw new Error();
    const account = accountResponse.data;
    return accountMapper(account.data as AccountDto);
  } catch (ex) {
    throw new Error("Unable to fetch account :: " + ex.message);
  }
};
const profile = async (
  account: AccountInternal,
  _: never,
  context: BankServiceContext,
): Promise<Profile> => {
  try {
    const profileResponse = await axios.get<ProfileAPIRes>(
      `${URLS.PROFILE_API_URL}/${account.userId}`,
      {
        headers: {
          authorization: context.authorization,
        },
      },
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
  {
    input: { accountType, userId, balance, accountNickname },
  }: MutationCreateAccountArgs,
  context: BankServiceContext,
) => {
  if (userId && !UserUtils.isAdmin(context.user)) {
    throw new Error("Only admins can specify userId when creating an account");
  }
  userId = userId ?? context.user.user_id; // Default to the authenticated user's ID if not provided
  try {
    const accountResponse = await axios.post<
      AccountAPIRes,
      AxiosResponse<AccountAPIRes>,
      CreateAccountDto
    >(
      URLS.ACCOUNT_API_URL,
      {
        accountType,
        userId,
        balance: balance ?? 0,
        accountNickname: accountNickname ?? "",
      },
      {
        headers: {
          authorization: context.authorization,
        },
      },
    );
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
