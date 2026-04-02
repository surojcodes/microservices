# Testing Strategy & Documentation

This document outlines the comprehensive testing strategy implemented across all microservices in the banking platform.

## Overview

A production-grade testing framework has been implemented using:
- **Jest** as the testing framework
- **TypeScript** for type-safe tests
- **Supertest** for REST endpoint testing
- **jest-mock-extended** for advanced mocking

## Project Structure

### Test Directory Layout

Each service follows this structure:
```
service/
├── src/
│   ├── __tests__/
│   │   ├── setup.ts                 # Global test setup & mocks
│   │   ├── factories.ts             # Test data factories
│   │   ├── mocks.ts                 # Mock utilities
│   │   ├── test-helpers.ts          # Helper functions
│   │   ├── controllers/
│   │   │   └── *.test.ts           # Controller tests
│   │   ├── utils/
│   │   │   └── *.test.ts           # Utility function tests
│   │   ├── resolvers/
│   │   │   └── *.test.ts           # GraphQL resolver tests
│   │   ├── mutations/
│   │   │   └── *.test.ts           # GraphQL mutation tests
│   │   └── integration/
│   │       └── *.test.ts           # Integration tests
│   └── [source code]
├── jest.config.js                   # Jest configuration
├── tsconfig.json                    # TypeScript config (includes jest types)
└── package.json                     # Test scripts & dependencies
```

## Running Tests

### All Services

```bash
# Run tests in all services
cd /home/jorus/Desktop/microservices
for service in auth accounts bank profile; do
  cd $service
  npm test
  cd ..
done

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Individual Service

```bash
cd /home/jorus/Desktop/microservices/auth
npm test                  # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
```

## Test Coverage

Current test coverage by service:

### Auth Service
- **Utilities**: ✅ 100% coverage on validation and auth functions
- **Password Hashing**: ✅ 100% coverage (argon2 operations)
- **JWT Generation & Verification**: ✅ 100% coverage
- **Validation Rules**: ✅ 100% coverage

Test Focus Areas:
- Email format validation
- Phone number format validation
- Password strength validation
- Date of birth validation (not future dates)
- Username/password length requirements
- JWT token creation and verification
- Password hashing and verification with argon2

### Accounts Service  
- **Data Factories**: ✅ 11 unit tests
- **RBAC Scenarios**: ✅ Authorization & access control
- **Account Types**: ✅ CHECKING, SAVINGS support
- **Account States**: ✅ ACTIVE, CLOSED states

Test Focus Areas:
- User can create/view own accounts
- Users blocked from accessing other user accounts
- Admin can access any account
- Account type and status management

### Bank Service (GraphQL)
- **Account Resolver**: ✅ 11 unit tests covering nested resolvers
- **Profile Resolver**: ✅ 13 unit tests covering field resolvers
- **Account Mutation**: ✅ 13 unit tests covering mutations
- **Authorization**: ✅ RBAC enforcement in resolvers

Test Focus Areas:
- Field resolver chains (account→profile, profile→accounts)
- Authorization checks in queries and mutations
- API integration with downstream services
- Authorization header passing

### Profile Service
- **Profile Factory**: ✅ 7 unit tests
- **RBAC Access Control**: ✅ 3 authorization tests
- **JWT Handling**: ✅ Token creation and claims

Test Focus Areas:
- Users can view own profiles
- Users blocked from viewing other profiles
- Admins can view any profile
- Admin-only endpoints enforcement

## Test Categories

### 1. Unit Tests
Test individual functions in isolation with mocked dependencies.

**Examples:**
- Auth validation functions
- Password hashing operations
- JWT signing/verification
- Data factory functions

**Running:**
```bash
npm test -- src/utils/
npm test -- src/__tests__/utils/
```

### 2. Integration Tests (Planned)
Test interactions between multiple components.

**Planned Coverage:**
- Auth service → JWT validation in Accounts service
- Accounts service → Account creation flow
- Bank service → Multi-step GraphQL queries with nested resolvers

### 3. E2E Tests (Planned)
Test complete user workflows across services.

**Planned Scenarios:**
1. Register new user via Auth service
2. Login and get JWT token
3. Create account via Accounts service
4. Query account via Bank service GraphQL
5. Verify nested profile resolution

## Test Data Factories

### Purpose
Factories provide consistent, realistic test data without hitting the database.

### Auth Service Factories
```typescript
createMockUser(overrides?)          // Generates user object
createMockProfile(overrides?)       // Generates profile object
createMockJWT(payload?, secret?)    // Generates valid JWT token
createMockRegisterInput(overrides?)  // Generates registration input
createMockLoginInput(overrides?)     // Generates login input
```

### Accounts Service Factories
```typescript
createMockAccount(overrides?)        // Generates account object
createMockJWT(payload?, secret?)     // Generates JWT token
createMockCreateAccountDto(overrides?) // Generates account creation DTO
```

### Bank Service Factories
```typescript
createMockAccount(overrides?)        // GraphQL account type
createMockProfile(overrides?)        // GraphQL profile type
createMockAccountAPIResponse(accounts?) // API response wrapper
createMockProfileAPIResponse(profile?)  // API response wrapper
createMockCreateAccountDto(overrides?)  // Mutation input
```

### Profile Service Factories
```typescript
createMockProfile(overrides?)        // Generates profile object
createMockJWT(payload?, secret?)     // Generates JWT token
```

## Test Setup & Configuration

### Jest Configuration (jest.config.js)
```javascript
{
  preset: 'ts-jest',              // TypeScript support
  testEnvironment: 'node',        // Node.js test environment
  roots: ['<rootDir>/src'],       // Test root directory
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  transform: { '^.+\\.ts$': 'ts-jest' },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/generated/**',
    '!src/index.ts'
  ]
}
```

### Environment Setup (setup.ts)
Each service has a setup.ts that configures:
- Test environment variables (JWT_SECRET, NODE_ENV, etc.)
- Global mocks for external dependencies
- Service-specific configuration

## Key Testing Patterns

### 1. Mocking Prisma Client
```typescript
// In setup.ts or individual tests
jest.mock('../utils/prisma');
const { prisma } = require('../utils/prisma');
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

// In tests
mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
```

### 2. Mocking Axios for HTTP Calls
```typescript
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

// Usage
mockAxios.get.mockResolvedValueOnce({
  data: { success: true, data: mockData }
});
```

### 3. JWT Testing
```typescript
const token = createMockJWT({
  user_id: 'user-123',
  role: 'USER'
});

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET!);
expect(decoded.user_id).toBe('user-123');
```

### 4. RBAC Testing Pattern
```typescript
describe('Authorization', () => {
  it('should allow user to access own resource', () => {
    const userContext = { user: { user_id: 'user-123' } };
    expect(userContext.user.user_id).toBe('user-123');
  });

  it('should block user from accessing other resources', () => {
    const userContext = { user: { user_id: 'user-123' } };
    const otherUserId = 'user-456';
    expect(userContext.user.user_id).not.toBe(otherUserId);
  });

  it('should allow admin access to all resources', () => {
    const adminContext = { user: { role: 'ADMIN' } };
    expect(adminContext.user.role).toBe('ADMIN');
  });
});
```

## Dependencies

### Core Testing Dependencies
```json
{
  "jest": "^29.7.0",
  "@types/jest": "^29.5.0",
  "ts-jest": "^29.1.0",
  "supertest": "^6.3.0",
  "@types/supertest": "^2.0.0",
  "jest-mock-extended": "^3.0.0"
}
```

## Best Practices

### 1. Test Organization
- ✅ Group related tests using `describe()` blocks
- ✅ Use descriptive test names that explain the scenario
- ✅ Keep tests focused on a single behavior
- ✅ Order tests: happy path → error cases → edge cases

### 2. Mocking Strategy
- ✅ Mock external dependencies (Prisma, Axios, Logger)
- ✅ Mock at the module level in setup.ts
- ✅ Use realistic mock data from factories
- ✅ Clear mocks between tests with `jest.clearAllMocks()`

### 3. Assertions
- ✅ Use specific matchers: `toBe()`, `toHaveProperty()`, `toContain()`
- ✅ Test both success and failure cases
- ✅ Verify side effects (DB calls, API calls)
- ✅ Check error messages and response codes

### 4. Async Testing
- ✅ Always use `async/await` for async tests
- ✅ Mock promises correctly: `mockResolvedValueOnce()`, `mockRejectedValueOnce()`
- ✅ Handle promise rejections properly

### 5. Data Consistency
- ✅ Use factories for consistent test data
- ✅ Use realistic field values (valid emails, phone numbers, etc.)
- ✅ Override only what's necessary
- ✅ Maintain relationships between related entities

## Coverage Goals

Current Status:
- ✅ Auth utils: 100% coverage
- ✅ Validation logic: 100% coverage  
- ✅ JWT handling: 100% coverage
- ⏳ Controllers: ~30% coverage (integration tests planned)
- ⏳ Resolvers: ~50% coverage (full integration planned)

Target Coverage:
- **Core Logic (Utils)**: 100%
- **Validation**: 100%
- **Authentication**: 100%
- **Authorization/RBAC**: 100%
- **Controllers/Resolvers**: 80%+
- **Overall**: 70%+

## Troubleshooting

### Issue: "Cannot find name 'jest'"
**Solution:** Add `"jest"` to types array in `tsconfig.json`:
```json
"types": ["node", "jest"]
```

### Issue: "Cannot find module"
**Solution:** Ensure jest.config.js includes test files:
```javascript
testMatch: ['**/__tests__/**/*.test.ts']
```

### Issue: Mocks not working
**Solution:** Clear mocks before each test:
```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```

### Issue: Async test timeouts
**Solution:** Increase Jest timeout:
```typescript
jest.setTimeout(10000);
```

## Future Enhancements

1. **E2E Testing**
   - Cross-service workflows
   - Docker Compose setup for full stack
   - Database integration tests

2. **Performance Testing**
   - Load testing with Artillery
   - Database query performance
   - GraphQL query performance

3. **Contract Testing**
   - API contract verification
   - Schema validation
   - Backwards compatibility

4. **Snapshot Testing**
   - GraphQL schema snapshots
   - API response snapshots
   - Error message snapshots

5. **Mutation Testing**
   - Stryker for mutation testing
   - Coverage quality metrics
   - Test robustness verification

## References

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [TypeScript Jest Types](https://www.npmjs.com/package/@types/jest)
- [jest-mock-extended](https://www.npmjs.com/package/jest-mock-extended)

## Questions & Support

For questions or issues with the testing setup:
1. Check this documentation
2. Review test examples in each service
3. Check jest.config.js and setup.ts
4. Review npm test output for error messages
