import { CustomerQuery } from "./customer-resolver";
import { AccountQuery } from "./account-resolver";

export default {
  Query: { ...CustomerQuery, ...AccountQuery },
};
