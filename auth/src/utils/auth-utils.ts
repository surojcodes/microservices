import argon2 from "argon2";

export const hashPassword = async (password: string) => {
  return await argon2.hash(password, {
    type: argon2.argon2id, // important
  });
};

export const isValidPassword = async (hash: string, password: string) => {
  return await argon2.verify(hash, password);
};
