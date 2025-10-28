export default async function globalSetup() {
  console.log('🚀 Starting global test setup...');
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.TEST_DATABASE_URL = 'postgresql://test:test@localhost:5432/vulhub_test';
  process.env.TEST_REDIS_HOST = 'localhost';
  process.env.TEST_REDIS_PORT = '6379';
  process.env.TEST_REDIS_DB = '1';
  
  console.log('✅ Global test setup completed');
}
