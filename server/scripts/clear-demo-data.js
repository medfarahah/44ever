import prisma from '../database/connection.js';

async function clearDemoData() {
  try {
    console.log('🗑️  Clearing demo data from database...');
    console.log('');
    
    // Connect to database
    await prisma.$connect();
    console.log('✅ Database connection established');
    console.log('');
    
    // Delete all demo customers (those with example.com emails)
    const allCustomers = await prisma.customer.findMany();
    const demoCustomers = allCustomers.filter(c => c.email.includes('example.com'));
    
    if (demoCustomers.length > 0) {
      const demoCustomerIds = demoCustomers.map(c => c.id);
      await prisma.customer.deleteMany({
        where: {
          id: {
            in: demoCustomerIds
          }
        }
      });
      console.log(`✅ Deleted ${demoCustomers.length} demo customers`);
    } else {
      console.log('ℹ️  No demo customers found');
    }
    
    // Delete all demo orders (those linked to demo customers OR demo users)
    const allOrders = await prisma.order.findMany({
      include: {
        customer: true,
        user: true
      }
    });
    
    const demoOrderIds = [];
    for (const order of allOrders) {
      // Check if order is linked to a demo customer
      if (order.customer && order.customer.email && order.customer.email.includes('example.com')) {
        demoOrderIds.push(order.id);
      }
      // Check if order is linked to a demo user
      else if (order.user && order.user.email && order.user.email.includes('example.com')) {
        demoOrderIds.push(order.id);
      }
      // Check shipping email for demo data
      else if (order.shipping && typeof order.shipping === 'object' && order.shipping.email && order.shipping.email.includes('example.com')) {
        demoOrderIds.push(order.id);
      }
    }
    
    if (demoOrderIds.length > 0) {
      await prisma.order.deleteMany({
        where: {
          id: {
            in: demoOrderIds
          }
        }
      });
      console.log(`✅ Deleted ${demoOrderIds.length} demo orders`);
    } else {
      console.log('ℹ️  No demo orders found');
    }
    
    // Delete all demo users (those with example.com emails, except admin)
    const allUsers = await prisma.user.findMany();
    const demoUsers = allUsers.filter(u => 
      u.email.includes('example.com') && u.role !== 'admin'
    );
    
    if (demoUsers.length > 0) {
      const demoUserIds = demoUsers.map(u => u.id);
      await prisma.user.deleteMany({
        where: {
          id: {
            in: demoUserIds
          }
        }
      });
      console.log(`✅ Deleted ${demoUsers.length} demo users`);
    } else {
      console.log('ℹ️  No demo users found');
    }
    
    // Delete all demo franchise applications (those with example.com emails)
    const allApplications = await prisma.franchiseApplication.findMany();
    const demoApplications = allApplications.filter(app => app.email.includes('example.com'));
    
    if (demoApplications.length > 0) {
      const demoAppIds = demoApplications.map(app => app.id);
      await prisma.franchiseApplication.deleteMany({
        where: {
          id: {
            in: demoAppIds
          }
        }
      });
      console.log(`✅ Deleted ${demoApplications.length} demo franchise applications`);
    } else {
      console.log('ℹ️  No demo franchise applications found');
    }
    
    console.log('✅ Demo data cleared successfully');
    console.log('📦 Products are kept (not demo data)');
    
  } catch (error) {
    console.error('❌ Error clearing demo data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));

if (isMainModule || process.argv[1]?.includes('clear-demo-data')) {
  console.log('🚀 Starting demo data cleanup...');
  clearDemoData()
    .then(() => {
      console.log('');
      console.log('✅ Done');
      process.exit(0);
    })
    .catch((error) => {
      console.error('');
      console.error('❌ Failed:', error);
      console.error(error.stack);
      process.exit(1);
    });
}

export default clearDemoData;
