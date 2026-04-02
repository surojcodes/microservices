import { validateRegisterInput, validateLoginInput } from '../../utils/validation-utils';
import { createMockRegisterInput, createMockLoginInput } from '../factories';
import { hashPassword, isValidPassword, signJWT } from '../../utils/auth-utils';
import { createMockJWT } from '../factories';

describe('Auth Controllers', () => {
  describe('Registration Validation', () => {
    it('should accept valid registration input', () => {
      const input = createMockRegisterInput();
      const result = validateRegisterInput(input);
      expect(result.success).toBe(true);
    });

    it('should reject incomplete input', () => {
      const result = validateRegisterInput({ username: 'test' } as any);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const result = validateRegisterInput(
        createMockRegisterInput({ email: 'not-email' })
      );
      expect(result.success).toBe(false);
      expect(result.message).toContain('email');
    });

    it('should reject invalid phone number', () => {
      const result = validateRegisterInput(
        createMockRegisterInput({ phone: '123' })
      );
      expect(result.success).toBe(false);
      expect(result.message).toContain('Phone');
    });

    it('should reject future dates', () => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      const result = validateRegisterInput(
        createMockRegisterInput({ dob: future.toISOString().split('T')[0] })
      );
      expect(result.success).toBe(false);
    });

    it('should reject short username', () => {
      const result = validateRegisterInput(
        createMockRegisterInput({ username: 'ab' })
      );
      expect(result.success).toBe(false);
      expect(result.message).toContain('Username');
    });

    it('should reject short password', () => {
      const result = validateRegisterInput(
        createMockRegisterInput({ password: 'ab' })
      );
      expect(result.success).toBe(false);
      expect(result.message).toContain('Password');
    });
  });

  describe('Login Validation', () => {
    it('should accept valid login input', () => {
      const input = createMockLoginInput();
      const result = validateLoginInput(input);
      expect(result.success).toBe(true);
    });

    it('should reject missing credentials', () => {
      expect(validateLoginInput({ username: 'test' } as any).success).toBe(false);
      expect(validateLoginInput({ password: 'test' } as any).success).toBe(false);
    });

    it('should reject empty string input', () => {
      const result = validateLoginInput({
        username: '   ',
        password: 'password',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('JWT Handling', () => {
    it('should create valid JWT tokens', () => {
      const token = createMockJWT();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should include payload in JWT', () => {
      const jwt = require('jsonwebtoken');
      const token = createMockJWT({
        user_id: 'custom-id',
        username: 'customuser',
      });
      const decoded = jwt.decode(token) as any;
      expect(decoded.user_id).toBe('custom-id');
      expect(decoded.username).toBe('customuser');
    });
  });

  describe('Password Hashing', () => {
    it('should hash passwords', async () => {
      const password = 'test-password-123';
      const hash = await hashPassword(password);
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
    });

    it('should verify correct passwords', async () => {
      const password = 'test-password-123';
      const hash = await hashPassword(password);
      const isValid = await isValidPassword(hash, password);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect passwords', async () => {
      const password = 'test-password-123';
      const hash = await hashPassword(password);
      const isValid = await isValidPassword(hash, 'wrong-password');
      expect(isValid).toBe(false);
    });
  });
});
