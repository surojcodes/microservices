export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Account = {
  __typename?: 'Account';
  accountNickname?: Maybe<Scalars['String']['output']>;
  accountNumber?: Maybe<Scalars['String']['output']>;
  accountStatus?: Maybe<AccountStatus>;
  accountType?: Maybe<AccountType>;
  balance?: Maybe<Scalars['Float']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  profile?: Maybe<Profile>;
};

export enum AccountStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export enum AccountType {
  Checking = 'CHECKING',
  Savings = 'SAVINGS'
}

export type CreateAccountInput = {
  accountNickname?: InputMaybe<Scalars['String']['input']>;
  accountType: AccountType;
  balance?: InputMaybe<Scalars['Float']['input']>;
  userId: Scalars['String']['input'];
};

export type CreateProfileInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  dob?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount: Account;
  createProfile: Profile;
};


export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


export type MutationCreateProfileArgs = {
  input: CreateProfileInput;
};

export type Profile = {
  __typename?: 'Profile';
  accounts?: Maybe<Array<Account>>;
  address?: Maybe<Scalars['String']['output']>;
  dob?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  account?: Maybe<Account>;
  accounts: Array<Account>;
  profile?: Maybe<Profile>;
  profiles: Array<Profile>;
};


export type QueryAccountArgs = {
  accountNumber?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProfileArgs = {
  userId?: InputMaybe<Scalars['String']['input']>;
};
