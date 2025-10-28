module.exports = {
  displayName: 'VulHub Leaderboard API Tests',
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '../../',
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.e2e-spec.ts',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/*.e2e-spec.ts',
    '!src/main.ts',
    '!src/app.module.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/common/testing/test-setup.ts'],
  moduleNameMapping: {
    '^@vulhub/(.*)$': '<rootDir>/packages/$1/src',
  },
  testTimeout: 30000,
  maxWorkers: 1, // Run tests sequentially to avoid database conflicts
  globalSetup: '<rootDir>/src/common/testing/global-setup.ts',
  globalTeardown: '<rootDir>/src/common/testing/global-teardown.ts',
};
