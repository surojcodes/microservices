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

//#region Query
const profiles = async (): Promise<CustomerProfile[]> => {
  try {
    const { data: profilesResponse } = await axios.get<ProfileAPIRes>(
      URLS.PROFILE_API_URL,
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
const profile = async (_: never, args: QueryProfileArgs) => {
  try {
    const profileResponse = await axios.get<ProfileAPIRes>(
      `${URLS.PROFILE_API_URL}/${args.userId}`,
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
): Promise<AccountInternal[]> => {
  try {
    const { data: accountsResponse } = await axios.get<AccountAPIRes>(
      `${URLS.ACCOUNT_API_URL}/user/${profile.userId}`,
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
) => {
  try {
    const profileResponse = await axios.post<
      ProfileAPIRes,
      AxiosResponse<ProfileAPIRes>,
      CreateProfileDto
    >(URLS.PROFILE_API_URL, {
      name,
      email,
      address,
      dob,
      phone,
    });
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
