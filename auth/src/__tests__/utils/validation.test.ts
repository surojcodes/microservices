import { validateRegisterInput, validateLoginInput } from '../../utils/validation-utils';
import { createMockRegisterInput, createMockLoginInput } from '../factories';

describe('Validation Utils', () => {
  describe('validateRegisterInput', () => {
    it('should return success for valid input', () => {
      const input = createMockRegisterInput();
      const result = validateRegisterInput(input);
      expect(result.success).toBe(true);
    });

    it('should reject empty request body', () => {
      const result = validateRegisterInput(null as any);
      expect(result.success).toBe(false);
      expect(result.message).toContain('required');
    });

    it('should reject missing required fields', () => {
      const result = validateRegisterInput({
        username: 'testuser',
      } as any);
      expect(result.success).toBe(false);
      expect(result.message).toContain('required');
    });

    it('should reject empty string fields', () => {
      const input = createMockRegisterInput({
        username: '   ',
      });
      const result = validateRegisterInput(input);
      expect(result.success).toBe(false);
      expect(result.message).toContain('must be non-empty');
    });

    it('should reject short username', () => {
      const input = createMockRegisterInput({
        username: 'ab',
      });
      const result = validateRegisterInput(input);
      expect(result.success).toBe(false);
      expect(result.message).toContain('Username');
    });

    it('should reject short password', () => {
      const input = createMockRegisterInput({
        password: 'ab',
      });
      const result = validateRegisterInput(input);
      expect(result.success).toBe(false);
      expect(result.message).toContain('Password');
    });

    it('should reject invalid email format', () => {
      const input = createMockRegisterInput({
        email: 'not-an-email',
      });
      const result = validateRegisterInput(input);
      expect(result.success).toBe(false);
      expect(result.message).toContain('email');
    });

    it('should accept valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'test.email@domain.co.uk',
        'a@b.c',
      ];

      validEmails.forEach((email) => {
        const input = createMockRegisterInput({ email });
        const result = validateRegisterInput(input);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid date of birth format', () => {
      const input = createMockRegisterInput({
        dob: 'not-a-date',
      });
      const result = validateRegisterInput(input);
      expect(result.success).toBe(false);
      expect(result.message).toContain('date');
    });

    it('should reject future date of birth', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const input = createMockRegisterInput({
        dob: futureDate.toISOString().split('T')[0],
      });
      const result = validateRegisterInput(input);
      expect(result.success).toBe(false);
    });

    it('should reject invalid phone number length', () => {
      const input = createMockRegisterInput({
        phone: '123456789', // 9 digits
      });
      const result = validateRegisterInput(input);
      expect(result.success).toBe(false);
      expect(result.message).toContain('Phone');
    });

    it('should reject phone number with non-digits', () => {
      const input = createMockRegisterInput({
        phone: '123456789a',
      });
      const result = validateRegisterInput(input);
      expect(result.success).toBe(false);
    });
  });

  describe('validateLoginInput', () => {
    it('should return success for valid input', () => {
      const input = createMockLoginInput();
      const result = validateLoginInput(input);
      expect(result.success).toBe(true);
    });

    it('should reject empty request body', () => {
      const result = validateLoginInput(null as any);
      expect(result.success).toBe(false);
      expect(result.message).toContain('required');
    });

    it('should reject missing username', () => {
      const result = validateLoginInput({
        password: 'password123',
      } as any);
      expect(result.success).toBe(false);
      expect(result.message).toContain('required');
    });

    it('should reject missing password', () => {
      const result = validateLoginInput({
        username: 'testuser',
      } as any);
      expect(result.success).toBe(false);
      expect(result.message).toContain('required');
    });

    it('should reject empty string username', () => {
      const input = createMockLoginInput({
        username: '   ',
      });
      const result = validateLoginInput(input);
      expect(result.success).toBe(false);
      expect(result.message).toContain('must be non-empty');
    });

    it('should reject empty string password', () => {
      const input = createMockLoginInput({
        password: '   ',
      });
      const result = validateLoginInput(input);
      expect(result.success).toBe(false);
      expect(result.message).toContain('must be non-empty');
    });
  });
});
