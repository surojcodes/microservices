export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type Account = {
  __typename?: "Account";
  accountNumber?: Maybe<Scalars["String"]["output"]>;
  accountType?: Maybe<AccountType>;
  balance?: Maybe<Scalars["Float"]["output"]>;
  customer?: Maybe<Customer>;
};

export enum AccountType {
  Checking = "CHECKING",
  Savings = "SAVINGS",
}

export type CreateAccountInput = {
  accountType: AccountType;
  balance?: InputMaybe<Scalars["Float"]["input"]>;
  customerId: Scalars["String"]["input"];
};

export type CreateCustomerInput = {
  email?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type Customer = {
  __typename?: "Customer";
  accounts?: Maybe<Array<Account>>;
  customerId?: Maybe<Scalars["String"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  createAccount: Account;
  createCustomer: Customer;
};

export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};

export type MutationCreateCustomerArgs = {
  input: CreateCustomerInput;
};

export type Query = {
  __typename?: "Query";
  account?: Maybe<Account>;
  accounts: Array<Account>;
  customer?: Maybe<Customer>;
  customers: Array<Customer>;
};

export type QueryAccountArgs = {
  accountNumber?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryCustomerArgs = {
  customerId?: InputMaybe<Scalars["String"]["input"]>;
};
