import { Customer, CustomerQuery } from "./customer-resolver";
import { AccountQuery, Account } from "./account-resolver";

export default {
  Query: { ...CustomerQuery, ...AccountQuery },
  Account,
  Customer,
};
