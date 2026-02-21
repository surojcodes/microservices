import { URLS } from "../config";
import {
  Customer,
  MutationCreateAccountArgs,
  QueryAccountArgs,
} from "../generated/generated-types";
import axios, { AxiosResponse } from "axios";
import {
  AccountAPIRes,
  AccountDto,
  AccountInternal,
  CreateAccountDto,
  CustomerAPIRes,
  CustomerDto,
} from "../types/api-response-types";
import { accountMapper, customerMapper } from "../mappers/mapper";

//#region Queries
const accounts = async (): Promise<AccountInternal[]> => {
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
): Promise<AccountInternal | undefined> => {
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
const customer = async (account: AccountInternal): Promise<Customer> => {
  try {
    const customerResponse = await axios.get<CustomerAPIRes>(
      `${URLS.CUSTOMERS_API_URL}/${account.customerId}`,
    );
    if (customerResponse.status === 404 || !customerResponse.data.success)
      throw new Error();
    const customer = customerResponse.data;
    return customerMapper(customer.data as CustomerDto);
  } catch (ex) {
    throw new Error("Unable to fetch customer :: " + ex.message);
  }
};
//#endregion

//#region Mutations
const createAccount = async (
  _: never,
  { input: { accountType, customerId, balance } }: MutationCreateAccountArgs,
) => {
  try {
    const accountResponse = await axios.post<
      AccountAPIRes,
      AxiosResponse<AccountAPIRes>,
      CreateAccountDto
    >(URLS.ACCOUNTS_API_URL, {
      accountType,
      customerId,
      balance: balance ?? 0,
    });
    if (!accountResponse.data.success) throw new Error();
    const newAccount = accountResponse.data.data as AccountDto;
    return accountMapper(newAccount);
  } catch (ex) {
    throw new Error("Unable to create account :: " + ex.message);
  }
};
//#endregion

export const AccountQuery = { accounts, account };
export const Account = { customer };
export const AccountMutation = { createAccount };
