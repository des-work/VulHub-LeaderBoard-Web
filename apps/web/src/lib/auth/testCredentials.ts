/**
 * Test credentials for local development with mock authentication
 * These are ONLY used when NEXT_PUBLIC_USE_MOCK_AUTH=true
 */

export interface TestAccount {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'grader' | 'student';
  points: number;
  level: number;
}

export const TEST_ACCOUNTS: TestAccount[] = [
  {
    email: 'admin@vulhub.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    points: 0,
    level: 1,
  },
  {
    email: 'grader@vulhub.com',
    password: 'grader123',
    name: 'Grader User',
    role: 'grader',
    points: 500,
    level: 2,
  },
  {
    email: 'student@vulhub.com',
    password: 'student123',
    name: 'Student User',
    role: 'student',
    points: 1500,
    level: 4,
  },
  {
    email: 'neo@matrix.io',
    password: 'matrix123',
    name: 'Neo',
    role: 'student',
    points: 1820,
    level: 4,
  },
  {
    email: 'trinity@matrix.io',
    password: 'matrix123',
    name: 'Trinity',
    role: 'student',
    points: 1710,
    level: 4,
  },
];

/**
 * Validate test credentials against the predefined accounts
 * @param email - User email
 * @param password - User password
 * @returns TestAccount if valid, null if invalid
 */
export function validateTestCredentials(email: string, password: string): TestAccount | null {
  const account = TEST_ACCOUNTS.find(
    (acc) => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
  );
  return account || null;
}

/**
 * Get a summary of available test accounts (without passwords)
 */
export function getTestAccountsSummary() {
  return TEST_ACCOUNTS.map((acc) => ({
    email: acc.email,
    role: acc.role,
    name: acc.name,
  }));
}

