import { URLS } from "../config";
import { Customer, QueryAccountArgs } from "../generated/generated-types";
import axios from "axios";
import {
  AccountAPIRes,
  AccountDto,
  AccountInternal,
  CustomerAPIRes,
  CustomerDto,
} from "../types/api-response-types";
import { accountMapper, customerMapper } from "../mappers/mapper";

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
export const AccountQuery = {
  accounts,
  account,
};
export const Account = {
  customer,
};
