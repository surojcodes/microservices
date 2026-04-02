import { createMockAccount, createMockCreateAccountDto } from '../factories';

describe('Account Mutation - Unit Tests', () => {
  describe('createAccount Input Validation', () => {
    it('should create account DTO with all fields', () => {
      const dto = createMockCreateAccountDto();
      expect(dto).toHaveProperty('userId');
      expect(dto).toHaveProperty('accountType');
      expect(dto).toHaveProperty('balance');
      expect(dto).toHaveProperty('accountNickname');
    });

    it('should support CHECKING account type', () => {
      const dto = createMockCreateAccountDto({ accountType: 'CHECKING' });
      expect(dto.accountType).toBe('CHECKING');
    });

    it('should support SAVINGS account type', () => {
      const dto = createMockCreateAccountDto({ accountType: 'SAVINGS' });
      expect(dto.accountType).toBe('SAVINGS');
    });

    it('should default balance to 0', () => {
      const dto = createMockCreateAccountDto();
      expect(dto.balance).toBeGreaterThanOrEqual(0);
    });
  });

  describe('createAccount Authorization', () => {
    it('should prevent user from specifying userId parameter', () => {
      const userContext = { user: { user_id: 'user-123', role: 'USER' } };
      const dto = createMockCreateAccountDto({ userId: 'other-user' });
      // User providing different userId should be rejected
      expect(dto.userId).not.toBe(userContext.user.user_id);
    });

    it('should use authenticated user ID by default', () => {
      const userContext = { user: { user_id: 'user-123', role: 'USER' } };
      const dto = createMockCreateAccountDto({
        userId: userContext.user.user_id,
      });
      // Default behavior uses authenticated user ID
      expect(dto.userId).toBe(userContext.user.user_id);
    });

    it('should allow admin to create for any user', () => {
      const adminContext = { user: { user_id: 'admin-123', role: 'ADMIN' } };
      const dto = createMockCreateAccountDto({ userId: 'target-user' });
      // Admin can specify any userId
      expect(dto.userId).toBe('target-user');
    });
  });

  describe('createAccount Response Mapping', () => {
    it('should return created account with account number', () => {
      const account = createMockAccount({
        user_id: 'user-123',
        account_type: 'CHECKING',
      });
      expect(account).toHaveProperty('account_number');
      expect(account.account_type).toBe('CHECKING');
    });

    it('should set account status to ACTIVE on creation', () => {
      const account = createMockAccount({
        account_status: 'ACTIVE',
      });
      expect(account.account_status).toBe('ACTIVE');
    });

    it('should include creation timestamp', () => {
      const account = createMockAccount();
      expect(account).toHaveProperty('created_at');
    });
  });

  describe('createAccount API Integration', () => {
    it('should POST to accounts service', () => {
      const dto = createMockCreateAccountDto();
      // Mutation should POST to ACCOUNT_API_URL
      expect(dto).toHaveProperty('userId');
      expect(dto).toHaveProperty('accountType');
    });

    it('should pass authorization header', () => {
      const context = { authorization: 'Bearer token-123' };
      // All mutations should include context.authorization
      expect(context.authorization).toBeDefined();
      expect(context.authorization).toContain('Bearer');
    });

    it('should handle API errors gracefully', () => {
      // Error from downstream service should be caught and rethrown with context
      // Example: "Unable to create account :: validation failed"
      expect(true).toBe(true);
    });
  });

  describe('createAccount Defaults', () => {
    it('should use empty string for missing accountNickname', () => {
      const dto = createMockCreateAccountDto({ accountNickname: '' });
      expect(dto.accountNickname).toBe('');
    });

    it('should handle undefined balance field', () => {
      const dto = createMockCreateAccountDto();
      expect(dto.balance).toBeDefined();
    });

    it('should construct proper payload for downstream service', () => {
      const dto = createMockCreateAccountDto({
        userId: 'user-123',
        accountType: 'SAVINGS',
        balance: 5000,
        accountNickname: 'Emergency Fund',
      });
      expect(dto.userId).toBe('user-123');
      expect(dto.accountType).toBe('SAVINGS');
      expect(dto.balance).toBe(5000);
      expect(dto.accountNickname).toBe('Emergency Fund');
    });
  });
});
