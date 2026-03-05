import { Profile, ProfileQuery } from "./profile-resolver";
import { AccountQuery, Account, AccountMutation } from "./account-resolver";

export default {
  Query: { ...ProfileQuery, ...AccountQuery },
  Account,
  Profile,
  Mutation: { ...AccountMutation },
};
