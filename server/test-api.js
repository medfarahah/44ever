import 'dotenv/config';
import https from 'https';
import http from 'http';

const API_BASE_URL = process.env.API_BASE_URL || process.argv[2] || 'http://localhost:5000/api';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let passed = 0;
let failed = 0;

async function test(endpoint, method = 'GET', body = null, token = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json().catch(() => ({ error: 'No JSON response' }));

    if (response.ok) {
      console.log(`${colors.green}✅${colors.reset} ${method} ${endpoint} - Status: ${response.status}`);
      passed++;
      return { success: true, data, token: data.token };
    } else {
      console.log(`${colors.red}❌${colors.reset} ${method} ${endpoint} - Status: ${response.status}`);
      console.log(`   Error: ${data.error || data.message || 'Unknown error'}`);
      failed++;
      return { success: false, data };
    }
  } catch (error) {
    console.log(`${colors.red}❌${colors.reset} ${method} ${endpoint} - Network Error`);
    console.log(`   ${error.message}`);
    failed++;
    return { success: false };
  }
}

async function runTests() {
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  API Endpoint Testing${colors.reset}`);
  console.log(`${colors.blue}  Base URL: ${API_BASE_URL}${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

  // Health Check
  console.log(`${colors.yellow}Health Check${colors.reset}`);
  await test('/health');
  console.log('');

  // Auth Endpoints
  console.log(`${colors.yellow}Authentication Endpoints${colors.reset}`);
  
  // Test registration
  const testEmail = `test${Date.now()}@example.com`;
  const registerResult = await test('/auth/register', 'POST', {
    name: 'Test User',
    email: testEmail,
    password: 'test123456',
    phone: '1234567890'
  });
  console.log('');

  // Test login with registered user
  let userToken = null;
  if (registerResult.success) {
    const loginResult = await test('/auth/login', 'POST', {
      email: testEmail,
      password: 'test123456'
    });
    if (loginResult.success) {
      userToken = loginResult.token;
    }
  }
  console.log('');

  // Test admin login (hardcoded)
  const adminLoginResult = await test('/auth/login', 'POST', {
    email: 'admin',
    password: 'admin123'
  });
  let adminToken = adminLoginResult.token || null;
  console.log('');

  // Products Endpoints
  console.log(`${colors.yellow}Products Endpoints${colors.reset}`);
  await test('/products');
  await test('/products/1');
  console.log('');

  // Orders Endpoints (protected)
  console.log(`${colors.yellow}Orders Endpoints${colors.reset}`);
  await test('/orders'); // Should fail without token
  if (adminToken) {
    await test('/orders', 'GET', null, adminToken);
  }
  console.log('');

  // Franchise Endpoints
  console.log(`${colors.yellow}Franchise Endpoints${colors.reset}`);
  const franchiseResult = await test('/franchise', 'POST', {
    firstName: 'John',
    lastName: 'Doe',
    email: `franchise${Date.now()}@example.com`,
    phone: '1234567890',
    company: 'Test Company',
    location: 'Test Location',
    investmentRange: '$50,000 - $100,000',
    experience: '5 years',
    message: 'Test franchise application'
  });
  console.log('');

  // Customers Endpoints (protected)
  console.log(`${colors.yellow}Customers Endpoints${colors.reset}`);
  await test('/customers'); // Should fail without token
  if (adminToken) {
    await test('/customers', 'GET', null, adminToken);
  }
  console.log('');

  // Auth - Get current user (protected)
  console.log(`${colors.yellow}User Profile Endpoints${colors.reset}`);
  if (userToken) {
    await test('/auth/me', 'GET', null, userToken);
  }
  console.log('');

  // Summary
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  Test Summary${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Total: ${passed + failed}`);
  console.log('');

  if (failed === 0) {
    console.log(`${colors.green}🎉 All tests passed!${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`${colors.red}⚠️  Some tests failed. Check the errors above.${colors.reset}`);
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
