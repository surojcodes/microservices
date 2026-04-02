import jwt from 'jsonwebtoken';

export const createMockProfile = (overrides?: Partial<any>) => ({
  profile_id: 'profile-123',
  user_id: 'test-user-123',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890',
  dob: '1990-01-01',
  address: '123 Main St',
  created_at: new Date(),
  updated_at: new Date(),
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
