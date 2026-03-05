import { UserRole } from "../types/bank-api-types";

const isAdmin = (user: any): boolean => {
  return user.role === UserRole.ADMIN;
};
export const UserUtils = { isAdmin };
