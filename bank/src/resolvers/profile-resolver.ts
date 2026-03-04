import axios, { AxiosResponse } from "axios";
import {
  Profile as CustomerProfile,
  MutationCreateProfileArgs,
  QueryProfileArgs,
} from "../generated/generated-types";
import {
  AccountAPIRes,
  AccountDto,
  AccountInternal,
  CreateProfileDto,
  ProfileAPIRes,
  ProfileDto,
} from "../types/downstream-types";
import { URLS } from "../config";
import { accountMapper, profileMapper } from "../mappers/mapper";
import { BankServiceContext } from "../types/bank-api-types";

//#region Query
const profiles = async (
  _: never,
  __: never,
  context: BankServiceContext,
): Promise<CustomerProfile[]> => {
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
  try {
    const profileResponse = await axios.get<ProfileAPIRes>(
      `${URLS.PROFILE_API_URL}/${args.userId}`,
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
      throw new Error();
    }
  } catch (ex) {
    throw new Error(
      "Unable to fetch accounts :: " + ex.response?.data?.message || ex.message,
    );
  }
};
//#endregion

//#region Mutation
const createProfile = async (
  _: never,
  { input: { email, name, address, dob, phone } }: MutationCreateProfileArgs,
  context: BankServiceContext,
) => {
  try {
    const profileResponse = await axios.post<
      ProfileAPIRes,
      AxiosResponse<ProfileAPIRes>,
      CreateProfileDto
    >(
      URLS.PROFILE_API_URL,
      {
        name,
        email,
        address,
        dob,
        phone,
      },
      {
        headers: {
          authorization: context.authorization,
        },
      },
    );
    if (!profileResponse.data.success) throw new Error();
    const newProfile = profileResponse.data.data as ProfileDto;
    return profileMapper(newProfile);
  } catch (ex) {
    throw new Error(
      "Unable to create profile :: " + ex.response?.data?.message || ex.message,
    );
  }
};
//#endregion

export const ProfileQuery = { profiles, profile };
export const Profile = { accounts };
export const ProfileMutation = { createProfile };
