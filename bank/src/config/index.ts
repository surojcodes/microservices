export const URLS = {
  ACCOUNTS_API_URL: `http://${process.env.ACCOUNT_API_HOST}:3001/accounts`,
  PROFILES_API_URL: `http://${process.env.PROFILE_API_HOST}:3000/profiles`,
} as const;
