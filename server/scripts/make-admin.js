import 'dotenv/config';
import prisma from '../database/connection.js';

async function makeAdmin() {
  try {
    const email = process.argv[2];
    
    if (!email) {
      console.log('Usage: node make-admin.js <email>');
      console.log('Example: node make-admin.js user@example.com');
      process.exit(1);
    }

    console.log(`Making ${email} an admin...`);
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!existingUser) {
      console.log(`❌ User with email ${email} not found.`);
      console.log('Please register the user first, or use create-admin.js to create a new admin user.');
      await prisma.$disconnect();
      process.exit(1);
    }
    
    if (existingUser.role === 'admin') {
      console.log(`✅ User ${email} is already an admin!`);
      await prisma.$disconnect();
      process.exit(0);
    }
    
    // Update user to admin
    const updated = await prisma.user.update({
      where: { id: existingUser.id },
      data: { role: 'admin' }
    });
    
    console.log('✅ User updated to admin successfully!');
    console.log('User ID:', updated.id);
    console.log('Name:', updated.name);
    console.log('Email:', updated.email);
    console.log('Role:', updated.role);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

makeAdmin();
