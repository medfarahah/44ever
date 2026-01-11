import 'dotenv/config';
import prisma from './database/connection.js';

async function checkStartup() {
  console.log('🔍 Checking server startup requirements...\n');

  // Check environment variables
  console.log('1. Environment Variables:');
  const requiredVars = ['DATABASE_URL'];
  const optionalVars = ['PORT', 'JWT_SECRET', 'FRONTEND_URL', 'NODE_ENV'];
  
  let allGood = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      // Mask sensitive parts
      const masked = varName === 'DATABASE_URL' 
        ? value.replace(/:[^:@]+@/, ':****@')
        : value;
      console.log(`   ✅ ${varName}: ${masked.substring(0, 50)}...`);
    } else {
      console.log(`   ❌ ${varName}: NOT SET`);
      allGood = false;
    }
  });
  
  optionalVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`   ℹ️  ${varName}: ${value}`);
    } else {
      console.log(`   ⚠️  ${varName}: Not set (using default)`);
    }
  });
  
  console.log('');

  // Check database connection
  console.log('2. Database Connection:');
  try {
    await prisma.$connect();
    console.log('   ✅ Database connection successful');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`   ✅ Database query successful (${userCount} users found)`);
  } catch (error) {
    console.log('   ❌ Database connection failed:', error.message);
    allGood = false;
  }
  
  console.log('');

  // Check port
  console.log('3. Server Port:');
  const PORT = process.env.PORT || 5000;
  console.log(`   ℹ️  Will listen on port: ${PORT}`);
  console.log('');

  // Summary
  console.log('📊 Summary:');
  if (allGood) {
    console.log('   ✅ All checks passed! Server should start successfully.');
  } else {
    console.log('   ❌ Some checks failed. Please fix the issues above.');
  }
  
  await prisma.$disconnect();
  process.exit(allGood ? 0 : 1);
}

checkStartup().catch(error => {
  console.error('❌ Startup check failed:', error);
  process.exit(1);
});
