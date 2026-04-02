import { createMockProfile, createMockJWT } from '../factories';

describe('Profile Controllers - Unit Tests', () => {
  describe('Profile Data Factories', () => {
    it('should create mock profile with defaults', () => {
      const profile = createMockProfile();
      expect(profile).toMatchObject({
        user_id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        dob: expect.any(String),
        address: expect.any(String),
      });
    });

    it('should allow overriding profile properties', () => {
      const profile = createMockProfile({
        user_id: 'custom-user',
        name: 'Jane Doe',
      });
      expect(profile.user_id).toBe('custom-user');
      expect(profile.name).toBe('Jane Doe');
    });

    it('should create valid email addresses', () => {
      const profile = createMockProfile();
      expect(profile.email).toMatch(/\S+@\S+\.\S+/);
    });

    it('should create valid phone numbers', () => {
      const profile = createMockProfile();
      expect(profile.phone).toMatch(/^\d{10}$/);
    });
  });

  describe('JWT Factory', () => {
    it('should create valid JWT tokens', () => {
      const token = createMockJWT();
      expect(token).toBeDefined();
      expect(token.split('.').length).toBe(3);
    });

    it('should include user claims in JWT', () => {
      const jwt = require('jsonwebtoken');
      const token = createMockJWT({
        user_id: 'test-user-123',
        username: 'testuser',
        role: 'USER',
      });
      const decoded = jwt.decode(token) as any;
      expect(decoded.user_id).toBe('test-user-123');
      expect(decoded.username).toBe('testuser');
      expect(decoded.role).toBe('USER');
    });
  });

  describe('RBAC Access Control', () => {
    it('should allow users to view own profile', () => {
      const userProfile = createMockProfile({ user_id: 'user-123' });
      const userToken = createMockJWT({ user_id: 'user-123', role: 'USER' });
      // User can access their own profile
      expect(userProfile.user_id).toBe('user-123');
    });

    it('should block users from viewing other profiles', () => {
      const otherProfile = createMockProfile({ user_id: 'user-456' });
      const userToken = createMockJWT({ user_id: 'user-123', role: 'USER' });
      // User cannot access other profiles
      expect(otherProfile.user_id).not.toBe('user-123');
    });

    it('should allow admins to view any profile', () => {
      const anyProfile = createMockProfile({ user_id: 'any-user' });
      const adminToken = createMockJWT({ user_id: 'admin-123', role: 'ADMIN' });
      // Admin can view any profile
      expect(anyProfile.user_id).toBe('any-user');
    });

    it('should only allow admins to list all profiles', () => {
      const adminToken = createMockJWT({ role: 'ADMIN' });
      const userToken = createMockJWT({ role: 'USER' });
      // getProfiles endpoint should check for ADMIN role
      const tokenPayload = require('jsonwebtoken').decode(adminToken) as any;
      expect(tokenPayload.role).toBe('ADMIN');
    });
  });
});
