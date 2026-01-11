import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '../database/connection.js';

async function createAdmin() {
  try {
    const args = process.argv.slice(2);

    if (args.length < 3) {
      console.log('Usage: node create-admin.js <name> <email> <password> [phone]');
      console.log('Example: node create-admin.js "Admin User" admin@example.com "securepassword123"');
      process.exit(1);
    }

    const [name, email, password, phone] = args;

    console.log('Creating admin user...');
    console.log('Name:', name);
    console.log('Email:', email);

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log('✅ User already exists and is already an admin!');
        process.exit(0);
      } else {
        // Update existing user to admin
        const updated = await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: 'admin' }
        });
        console.log('✅ Existing user updated to admin!');
        console.log('User ID:', updated.id);
        process.exit(0);
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: 'admin'
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('User ID:', user.id);
    console.log('Email:', user.email);
    console.log('Role:', user.role);

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createAdmin();
