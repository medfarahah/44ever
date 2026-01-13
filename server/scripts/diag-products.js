import prisma from '../database/connection.js';

async function listProducts() {
    try {
        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                image: true
            }
        });
        console.log('--- Current Products in DB ---');
        products.forEach(p => {
            console.log(`ID: ${p.id} | Name: ${p.name} | Image: ${p.image}`);
        });
        console.log('------------------------------');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

listProducts();
