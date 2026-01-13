import prisma from '../database/connection.js';

async function fixUploadPaths() {
    try {
        const products = await prisma.product.findMany({
            where: {
                image: {
                    startsWith: '/uploads'
                }
            }
        });

        console.log(`Found ${products.length} products with upload paths.`);

        for (const product of products) {
            const newPath = product.image.replace('/uploads/products/', '/images/');
            console.log(`Updating ${product.id}: ${product.image} -> ${newPath}`);

            await prisma.product.update({
                where: { id: product.id },
                data: {
                    image: newPath,
                    images: [newPath]
                }
            });
        }

        console.log('✅ Paths updated');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixUploadPaths();
