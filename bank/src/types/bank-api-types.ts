export interface JwtClaims {
  user_id: string;
  username: string;
  role: UserRole;
}
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}
export interface BankServiceContext {
  user: JwtClaims | string;
  authorization: string;
}
