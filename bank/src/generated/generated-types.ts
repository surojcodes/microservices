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
  /** Account nickname is optional and can be used to give a friendly name to the account. */
  accountNickname?: InputMaybe<Scalars['String']['input']>;
  /** accountType is required and must be either SAVINGS or CHECKING. */
  accountType: AccountType;
  /** Initial balance is optional and defaults to 0. If provided, it must be a non-negative value. */
  balance?: InputMaybe<Scalars['Float']['input']>;
  /** userID is optional and can only be specified by admins. If not provided, the account will be created for the authenticated user. */
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount: Account;
};


export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
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
  /** ADMIN ONLY */
  accountByUserId?: Maybe<Account>;
  accounts: Array<Account>;
  profile?: Maybe<Profile>;
  profiles: Array<Profile>;
};


export type QueryAccountArgs = {
  accountNumber: Scalars['String']['input'];
};


export type QueryAccountByUserIdArgs = {
  userId: Scalars['String']['input'];
};


export type QueryProfileArgs = {
  userId?: InputMaybe<Scalars['String']['input']>;
};
