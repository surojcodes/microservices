import { Customer, CustomerMutation, CustomerQuery } from "./customer-resolver";
import { AccountQuery, Account, AccountMutation } from "./account-resolver";

export default {
  Query: { ...CustomerQuery, ...AccountQuery },
  Account,
  Customer,
  Mutation: { ...AccountMutation, ...CustomerMutation },
};
