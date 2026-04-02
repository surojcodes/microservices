import jwt from 'jsonwebtoken';
import { UserRole } from '../models';

export const createMockUser = (overrides?: Partial<any>) => ({
  user_id: 'test-user-123',
  username: 'testuser',
  password: 'hashed-password-here',
  role: UserRole.USER,
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides,
});

export const createMockProfile = (overrides?: Partial<any>) => ({
  profile_id: 'test-profile-123',
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

export const createMockJWT = (
  payload?: Partial<any>,
  secret = process.env.JWT_SECRET || 'test-secret'
) => {
  const defaultPayload = {
    user_id: 'test-user-123',
    username: 'testuser',
    role: UserRole.USER,
  };
  return jwt.sign({ ...defaultPayload, ...payload }, secret, {
    expiresIn: '1h',
  });
};

export const createMockRegisterInput = (overrides?: Partial<any>) => ({
  username: 'newuser',
  password: 'Password123',
  name: 'New User',
  email: 'newuser@example.com',
  phone: '1234567890',
  dob: '1990-01-01',
  address: '456 Oak Ave',
  ...overrides,
});

export const createMockLoginInput = (overrides?: Partial<any>) => ({
  username: 'testuser',
  password: 'password123',
  ...overrides,
});
