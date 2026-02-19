import axios, { AxiosResponse } from "axios";
import {
  Customer as BankCustomer,
  MutationCreateCustomerArgs,
  QueryCustomerArgs,
} from "../generated/generated-types";
import {
  AccountAPIRes,
  AccountDto,
  AccountInternal,
  CreateCustomerDto,
  CustomerAPIRes,
  CustomerDto,
} from "../types/api-response-types";
import { URLS } from "../config";
import { accountMapper, customerMapper } from "../mappers/mapper";

//#region Query
const customers = async (): Promise<BankCustomer[]> => {
  try {
    const { data: customersResponse } = await axios.get<CustomerAPIRes>(
      URLS.CUSTOMERS_API_URL,
    );
    if (customersResponse.success) {
      const customers = customersResponse.data as CustomerDto[];
      return customers.map((customer) => customerMapper(customer));
    } else {
      throw new Error();
    }
  } catch (ex) {
    throw new Error("Unable to fetch customers :: " + ex.message);
  }
};
const customer = async (_: never, args: QueryCustomerArgs) => {
  try {
    const customerResponse = await axios.get<CustomerAPIRes>(
      `${URLS.CUSTOMERS_API_URL}/${args.customerId}`,
    );
    if (customerResponse.status === 404 || !customerResponse.data.success)
      throw new Error();
    const customer = customerResponse.data;
    return customerMapper(customer.data as CustomerDto);
  } catch (ex) {
    throw new Error("Unable to fetch customer :: " + ex.message);
  }
};
const accounts = async (customer: BankCustomer): Promise<AccountInternal[]> => {
  try {
    const { data: accountsResponse } = await axios.get<AccountAPIRes>(
      `${URLS.ACCOUNTS_API_URL}/customers/${customer.customerId}`,
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
//#endregion

//#region Mutation
const createCustomer = async (
  _: never,
  { input: { email, name } }: MutationCreateCustomerArgs,
) => {
  try {
    const customerResponse = await axios.post<
      CustomerAPIRes,
      AxiosResponse<CustomerAPIRes>,
      CreateCustomerDto
    >(URLS.CUSTOMERS_API_URL, {
      name,
      email,
    });
    if (!customerResponse.data.success) throw new Error();
    const newCustomer = customerResponse.data.data as CustomerDto;
    return customerMapper(newCustomer);
  } catch (ex) {
    throw new Error("Unable to create customer :: " + ex.message);
  }
};
//#endregion

export const CustomerQuery = { customers, customer };
export const Customer = { accounts };
export const CustomerMutation = { createCustomer };
