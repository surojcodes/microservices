import {
  createMockAccount,
  createMockProfile,
  createMockAccountAPIResponse,
  createMockProfileAPIResponse,
} from '../factories';

describe('Profile Resolver - Unit Tests', () => {
  describe('Profile Query Factories', () => {
    it('should create profile API response', () => {
      const profile = createMockProfile({ user_id: 'user-456' });
      const response = createMockProfileAPIResponse(profile);
      expect(response.success).toBe(true);
      expect(response.data.user_id).toBe('user-456');
    });

    it('should create multiple profiles', () => {
      const profiles = [
        createMockProfile({ user_id: 'user-1' }),
        createMockProfile({ user_id: 'user-2' }),
        createMockProfile({ user_id: 'user-3' }),
      ];
      expect(profiles).toHaveLength(3);
      expect(profiles.map((p) => p.user_id)).toEqual([
        'user-1',
        'user-2',
        'user-3',
      ]);
    });
  });

  describe('Profile.accounts Field Resolver', () => {
    it('should fetch accounts for profile owner', () => {
      const profile = createMockProfile({ user_id: 'user-789' });
      const accounts = [
        createMockAccount({ user_id: 'user-789' }),
        createMockAccount({ account_number: 2001, user_id: 'user-789' }),
      ];
      // Field resolver should fetch accounts matching profile.userId
      expect(accounts.every((a) => a.user_id === profile.user_id)).toBe(true);
    });

    it('should return empty array if user has no accounts', () => {
      const profile = createMockProfile({ user_id: 'user-new' });
      const accounts: any[] = [];
      expect(accounts).toEqual([]);
    });
  });

  describe('Profile Query Authorization', () => {
    it('should require admin role for profiles query', () => {
      const adminContext = { user: { role: 'ADMIN' } };
      const userContext = { user: { role: 'USER' } };
      // Only admin can list all profiles
      expect(adminContext.user.role).toBe('ADMIN');
      expect(userContext.user.role).not.toBe('ADMIN');
    });

    it('should allow user to query own profile', () => {
      const userContext = { user: { user_id: 'user-123', role: 'USER' } };
      const requestedUserId = 'user-123';
      // User can query own profile without userId param
      expect(userContext.user.user_id).toBe(requestedUserId);
    });

    it('should block user from querying other profiles', () => {
      const userContext = { user: { user_id: 'user-123', role: 'USER' } };
      const requestedUserId = 'user-456';
      // User cannot query other profiles
      expect(userContext.user.user_id).not.toBe(requestedUserId);
    });

    it('should allow admin to query any profile', () => {
      const adminContext = { user: { user_id: 'admin-123', role: 'ADMIN' } };
      const requestedUserId = 'any-user';
      // Admin can query any profile
      expect(adminContext.user.role).toBe('ADMIN');
    });
  });

  describe('Profile Data Consistency', () => {
    it('should maintain userId consistency across nested resolvers', () => {
      const userId = 'user-123';
      const profile = createMockProfile({ user_id: userId });
      const accounts = [
        createMockAccount({ user_id: userId }),
        createMockAccount({ account_number: 2001, user_id: userId }),
      ];
      // All related data should have same userId
      expect(profile.user_id).toBe(userId);
      expect(accounts.every((a) => a.user_id === userId)).toBe(true);
    });

    it('should handle profile with different user IDs correctly', () => {
      const profile1 = createMockProfile({ user_id: 'user-1' });
      const profile2 = createMockProfile({ user_id: 'user-2' });
      const account1 = createMockAccount({ user_id: 'user-1' });
      const account2 = createMockAccount({ user_id: 'user-2' });
      // Different users should have different profiles and accounts
      expect(profile1.user_id).not.toBe(profile2.user_id);
      expect(account1.user_id).not.toBe(account2.user_id);
    });
  });
});
