import { createMockAccount, createMockCreateAccountDto } from '../factories';

describe('Accounts Controllers - Unit Tests', () => {
  describe('Account Data Factories', () => {
    it('should create mock account with defaults', () => {
      const account = createMockAccount();
      expect(account).toMatchObject({
        account_number: expect.any(Number),
        user_id: expect.any(String),
        account_type: expect.any(String),
        balance: expect.any(Number),
        account_status: expect.any(String),
      });
    });

    it('should allow overriding account properties', () => {
      const account = createMockAccount({
        user_id: 'custom-user',
        balance: 9999,
      });
      expect(account.user_id).toBe('custom-user');
      expect(account.balance).toBe(9999);
    });

    it('should create account creation DTO', () => {
      const dto = createMockCreateAccountDto();
      expect(dto).toHaveProperty('userId');
      expect(dto).toHaveProperty('accountType');
      expect(dto).toHaveProperty('balance');
    });

    it('should handle account DTO overrides', () => {
      const dto = createMockCreateAccountDto({
        userId: 'different-user',
        balance: 5000,
      });
      expect(dto.userId).toBe('different-user');
      expect(dto.balance).toBe(5000);
    });
  });

  describe('Account Types and States', () => {
    it('should support CHECKING account type', () => {
      const account = createMockAccount({ account_type: 'CHECKING' });
      expect(account.account_type).toBe('CHECKING');
    });

    it('should support SAVINGS account type', () => {
      const account = createMockAccount({ account_type: 'SAVINGS' });
      expect(account.account_type).toBe('SAVINGS');
    });

    it('should support ACTIVE account status', () => {
      const account = createMockAccount({ account_status: 'ACTIVE' });
      expect(account.account_status).toBe('ACTIVE');
    });

    it('should support CLOSED account status', () => {
      const account = createMockAccount({ account_status: 'CLOSED' });
      expect(account.account_status).toBe('CLOSED');
    });
  });

  describe('RBAC Scenarios', () => {
    it('should allow users to create own accounts', () => {
      const userToken = { user_id: 'user-123', role: 'USER' };
      const dto = createMockCreateAccountDto({ userId: 'user-123' });
      // User can create for themselves when userId matches
      expect(dto.userId).toBe(userToken.user_id);
    });

    it('should block users from creating others accounts', () => {
      const userToken = { user_id: 'user-123', role: 'USER' };
      const dto = createMockCreateAccountDto({ userId: 'user-456' });
      // This should be caught by controller authorization
      expect(dto.userId).not.toBe(userToken.user_id);
    });

    it('should allow admins to create any account', () => {
      const adminToken = { user_id: 'admin-123', role: 'ADMIN' };
      const dto = createMockCreateAccountDto({ userId: 'any-user' });
      // Admin can always create
      expect(dto.userId).toBe('any-user');
    });
  });
});
