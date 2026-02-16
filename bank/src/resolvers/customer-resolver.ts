import axios from "axios";
import { Customer, QueryCustomerArgs } from "../generated/generated-types";
import { CustomerAPIRes, CustomerDto } from "../types/api-response-types";
import { URLS } from "../config";
import { customerMapper } from "../mappers/mapper";

const customers = async (): Promise<Customer[]> => {
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

export const CustomerQuery = {
  customers,
  customer,
};
