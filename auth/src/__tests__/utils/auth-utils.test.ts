import { hashPassword, isValidPassword, signJWT } from '../../utils/auth-utils';
import { createMockJWT } from '../factories';
import jwt from 'jsonwebtoken';

describe('Auth Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'test-password-123';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should produce different hashes for same password', async () => {
      const password = 'test-password-123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('isValidPassword', () => {
    it('should verify correct password', async () => {
      const password = 'test-password-123';
      const hash = await hashPassword(password);
      const isValid = await isValidPassword(hash, password);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'test-password-123';
      const hash = await hashPassword(password);
      const isValid = await isValidPassword(hash, 'wrong-password');

      expect(isValid).toBe(false);
    });

    it('should be case sensitive', async () => {
      const password = 'TestPassword123';
      const hash = await hashPassword(password);
      const isValid = await isValidPassword(hash, 'testpassword123');

      expect(isValid).toBe(false);
    });
  });

  describe('signJWT', () => {
    it('should create a valid JWT token', () => {
      const payload = {
        user_id: 'test-user-123',
        username: 'testuser',
        role: 'USER',
      };

      const token = signJWT(payload as any);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should sign token with correct issuer and audience', () => {
      const payload = {
        user_id: 'test-user-123',
        username: 'testuser',
        role: 'USER',
      };

      const token = signJWT(payload as any);
      const decoded = jwt.decode(token) as any;

      expect(decoded.iss).toBe('bank-api');
      expect(decoded.aud).toBe('bank-users');
    });

    it('should include payload in token', () => {
      const payload = {
        user_id: 'custom-user-id',
        username: 'customuser',
        role: 'ADMIN',
      };

      const token = signJWT(payload as any);
      const decoded = jwt.decode(token) as any;

      expect(decoded.user_id).toBe('custom-user-id');
      expect(decoded.username).toBe('customuser');
      expect(decoded.role).toBe('ADMIN');
    });

    it('should be verifiable with jwt.verify', () => {
      const payload = {
        user_id: 'test-user-123',
        username: 'testuser',
        role: 'USER',
      };

      const token = signJWT(payload as any);
      const verified = jwt.verify(token, process.env.JWT_SECRET!) as any;

      expect(verified.user_id).toBe(payload.user_id);
      expect(verified.username).toBe(payload.username);
      expect(verified.role).toBe(payload.role);
    });
  });
});
