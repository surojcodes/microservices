import axios from "axios";
import {
  Profile as CustomerProfile,
  QueryProfileArgs,
} from "../generated/generated-types";
import {
  AccountAPIRes,
  AccountDto,
  AccountInternal,
  ProfileAPIRes,
  ProfileDto,
} from "../types/downstream-types";
import { URLS } from "../config";
import { accountMapper, profileMapper } from "../mappers/mapper";
import { BankServiceContext } from "../types/bank-api-types";
import { UserUtils } from "../utils/user-utils";
import logger from "../logger";

//#region Query
const profiles = async (
  _: never,
  __: never,
  context: BankServiceContext,
): Promise<CustomerProfile[]> => {
  if (!UserUtils.isAdmin(context.user)) {
    logger.error("Only admins can get all profiles");
    throw new Error("Only admins can get all profiles");
  }
  try {
    const { data: profilesResponse } = await axios.get<ProfileAPIRes>(
      URLS.PROFILE_API_URL,
      {
        headers: {
          authorization: context.authorization,
        },
      },
    );
    if (profilesResponse.success) {
      const profiles = profilesResponse.data as ProfileDto[];
      return profiles.map((profile) => profileMapper(profile));
    } else {
      throw new Error();
    }
  } catch (ex) {
    logger.error(ex, "Error fetching profiles:");
    throw new Error(
      "Unable to fetch profiles :: " + ex.response?.data?.message || ex.message,
    );
  }
};
const profile = async (
  _: never,
  args: QueryProfileArgs,
  context: BankServiceContext,
) => {
  args.userId = args.userId || context.user?.user_id;
  if (
    !UserUtils.isAdmin(context.user) &&
    context.user?.user_id !== args.userId
  ) {
    logger.error("Only admins can get any profile");
    throw new Error("Only admins can get any profile");
  }
  try {
    const profileResponse = await axios.get<ProfileAPIRes>(
      `${URLS.PROFILE_API_URL}/${args.userId}`,
      {
        headers: {
          authorization: context.authorization,
        },
      },
    );
    if (profileResponse.status === 404 || !profileResponse.data.success) {
      logger.error(
        `Failed to fetch profile for user ${args.userId}: API responded with success=false`,
      );
      throw new Error();
    }
    const profile = profileResponse.data;
    return profileMapper(profile.data as ProfileDto);
  } catch (ex) {
    logger.error(ex, `Error fetching profile for user ${args.userId}:`);
    throw new Error(
      "Unable to fetch profile :: " + ex.response?.data?.message || ex.message,
    );
  }
};
const accounts = async (
  profile: CustomerProfile,
  _: never,
  context: BankServiceContext,
): Promise<AccountInternal[]> => {
  try {
    const { data: accountsResponse } = await axios.get<AccountAPIRes>(
      `${URLS.ACCOUNT_API_URL}/user/${profile.userId}`,
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
      logger.error(
        `Failed to fetch accounts for user ${profile.userId}: API responded with success=false`,
      );
      throw new Error();
    }
  } catch (ex) {
    logger.error(ex, `Error fetching accounts for user ${profile.userId}:`);
    throw new Error(
      "Unable to fetch accounts :: " + ex.response?.data?.message || ex.message,
    );
  }
};
//#endregion

export const ProfileQuery = { profiles, profile };
export const Profile = { accounts };
