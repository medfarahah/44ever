import prisma from '../database/connection.js';

async function updatePhoneSetting() {
    try {
        console.log('Available Prisma models:', Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')));

        // Try different model names
        const settingsModel = prisma.settings || prisma.Settings || prisma.setting || prisma.Setting;

        if (!settingsModel) {
            throw new Error('Settings/Setting model not found in Prisma client');
        }

        const setting = await settingsModel.upsert({
            where: { key: 'phone' },
            update: { value: '+252638596758' },
            create: {
                key: 'phone',
                value: '+252638596758',
                description: 'Store contact phone number'
            }
        });
        console.log('✅ Phone setting updated:', setting);
    } catch (error) {
        console.error('Error updating phone setting:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updatePhoneSetting();
