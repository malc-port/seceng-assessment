/**
 * Static key material for the test suite only.
 *
 * These values are generated once and committed deliberately so that the
 * signature fixtures below stay stable across runs. They are never loaded
 * outside of `NODE_ENV=test` and have no counterpart in any deployed tier.
 */

export const TEST_JWT_SECRET = 'test-only-jwt-secret-2f8c11b0';

export const TEST_PSP_WEBHOOK_SECRET = 'whsec_test_0000000000000000000000000000';

export const TEST_MERCHANT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiJvcHNAbm9ydGh3aW5kLW1hcmtldHBsYWNlLmNvbSIsIm1lcmNoYW50X2lkIjoibWNoXzg4NDIifQ.' +
  'k3Qb1nH9vZx7pLmT2sYwRc4dAeFgJhKiOu5NxCvBwEs';
