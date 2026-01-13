import 'dotenv/config';
import prisma from '../database/connection.js';
import bcrypt from 'bcryptjs';

async function resetPassword() {
    try {
        const email = process.argv[2];
        const newPassword = process.argv[3] || 'admin123';

        if (!email) {
            console.log('Usage: node reset-password.js <email> [newPassword]');
            process.exit(1);
        }

        const normalizedEmail = email.toLowerCase().trim();
        console.log(`Resetting password for ${normalizedEmail}...`);

        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });

        if (!user) {
            console.log(`❌ User ${email} not found.`);
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        console.log(`✅ Password reset successfully for ${normalizedEmail}`);
        console.log(`New Password: ${newPassword}`);

        await prisma.$disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

resetPassword();
