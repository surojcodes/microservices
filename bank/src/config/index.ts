export const URLS = {
  ACCOUNTS_API_URL: `http://${process.env.ACCOUNT_API_HOST}:3001/accounts`,
  CUSTOMERS_API_URL: `http://${process.env.CUSTOMER_API_HOST}:3000/customers`,
} as const;
