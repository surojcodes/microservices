import jwt from 'jsonwebtoken';

export const createMockAccount = (overrides?: Partial<any>) => ({
  account_number: 1001,
  user_id: 'test-user-123',
  account_type: 'CHECKING',
  balance: 1000.50,
  account_nickname: 'My Checking',
  account_status: 'ACTIVE',
  created_at: '2024-01-01',
  ...overrides,
});

export const createMockUser = (overrides?: Partial<any>) => ({
  user_id: 'test-user-123',
  username: 'testuser',
  role: 'USER',
  ...overrides,
});

export const createMockJWT = (
  payload?: Partial<any>,
  secret = process.env.JWT_SECRET || 'test-secret'
) => {
  const defaultPayload = {
    user_id: 'test-user-123',
    username: 'testuser',
    role: 'USER',
  };
  return jwt.sign({ ...defaultPayload, ...payload }, secret, {
    expiresIn: '1h',
  });
};

export const createMockCreateAccountDto = (overrides?: Partial<any>) => ({
  userId: 'test-user-123',
  accountType: 'CHECKING',
  balance: 5000,
  accountNickname: 'New Account',
  ...overrides,
});
