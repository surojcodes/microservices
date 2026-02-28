export const URLS = {
  ACCOUNT_API_URL: `http://${process.env.ACCOUNT_API_HOST}:3001/accounts`,
  PROFILE_API_URL: `http://${process.env.PROFILE_API_HOST}:3000/profiles`,
} as const;
