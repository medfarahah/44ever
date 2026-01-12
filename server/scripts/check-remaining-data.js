import prisma from '../database/connection.js';

async function checkRemainingData() {
  try {
    console.log('🔍 Checking for remaining demo data...');
    console.log('');
    
    await prisma.$connect();
    console.log('✅ Database connection established');
    console.log('');
    
    // Check all orders
    const allOrders = await prisma.order.findMany({
      include: {
        customer: true,
        user: true
      }
    });
    
    console.log(`📦 Total orders: ${allOrders.length}`);
    
    // Check for orders with demo-like data
    const suspiciousOrders = [];
    allOrders.forEach(order => {
      const shipping = order.shipping;
      if (shipping && typeof shipping === 'object') {
        // Check shipping email
        if (shipping.email && shipping.email.includes('example.com')) {
          suspiciousOrders.push({
            id: order.id,
            orderNumber: order.orderNumber,
            reason: 'Demo shipping email',
            email: shipping.email
          });
        }
        // Check shipping name for demo patterns
        else if (shipping.firstName && (
          shipping.firstName.includes('Guest') ||
          shipping.firstName.includes('Test') ||
          shipping.firstName.includes('Demo')
        )) {
          suspiciousOrders.push({
            id: order.id,
            orderNumber: order.orderNumber,
            reason: 'Demo-like shipping name',
            name: `${shipping.firstName} ${shipping.lastName || ''}`
          });
        }
      }
    });
    
    if (suspiciousOrders.length > 0) {
      console.log(`⚠️  Found ${suspiciousOrders.length} suspicious orders:`);
      suspiciousOrders.forEach(order => {
        console.log(`  - Order ${order.orderNumber}: ${order.reason} (${order.email || order.name})`);
      });
    } else {
      console.log('✅ No suspicious orders found');
    }
    
    // Check customers
    const allCustomers = await prisma.customer.findMany();
    console.log(`\n👥 Total customers: ${allCustomers.length}`);
    const demoCustomers = allCustomers.filter(c => c.email.includes('example.com'));
    if (demoCustomers.length > 0) {
      console.log(`⚠️  Found ${demoCustomers.length} demo customers still in database`);
    } else {
      console.log('✅ No demo customers found');
    }
    
    // Check users
    const allUsers = await prisma.user.findMany();
    console.log(`\n👤 Total users: ${allUsers.length}`);
    const demoUsers = allUsers.filter(u => u.email.includes('example.com') && u.role !== 'admin');
    if (demoUsers.length > 0) {
      console.log(`⚠️  Found ${demoUsers.length} demo users still in database`);
    } else {
      console.log('✅ No demo users found');
    }
    
    // Check franchise applications
    const allApps = await prisma.franchiseApplication.findMany();
    console.log(`\n🏢 Total franchise applications: ${allApps.length}`);
    const demoApps = allApps.filter(app => app.email.includes('example.com'));
    if (demoApps.length > 0) {
      console.log(`⚠️  Found ${demoApps.length} demo applications still in database`);
    } else {
      console.log('✅ No demo applications found');
    }
    
    console.log('\n✅ Check complete');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkRemainingData()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });
