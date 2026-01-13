import prisma from '../database/connection.js';

async function fixPaths() {
    try {
        const products = await prisma.product.findMany();
        console.log(`Checking ${products.length} products...`);

        const mapping = {
            "WhatsApp Image 2026-01-09 at 12.29.01.jpeg": "elixir.jpg",
            "WhatsApp Image 2026-01-09 at 12.29.01 (1).jpeg": "night-cream.jpg",
            "WhatsApp Image 2026-01-09 at 12.29.01 (2).jpeg": "cleansing-oil.jpg",
            "WhatsApp Image 2026-01-09 at 12.29.01 (3).jpeg": "eye-elixir.jpg",
            "WhatsApp Image 2026-01-09 at 12.28.59.jpeg": "golden-serum.jpg",
            "WhatsApp Image 2026-01-09 at 12.28.59 (1).jpeg": "face-mask.jpg",
            "WhatsApp Image 2026-01-09 at 12.28.59 (2).jpeg": "toner.jpg"
        };

        for (const product of products) {
            let updated = false;
            let newImage = product.image;

            for (const [oldName, newName] of Object.entries(mapping)) {
                if (product.image.includes(oldName)) {
                    newImage = `/images/${newName}`;
                    updated = true;
                    break;
                }
            }

            if (updated) {
                console.log(`Updating product ${product.id}: ${product.image} -> ${newImage}`);
                await prisma.product.update({
                    where: { id: product.id },
                    data: {
                        image: newImage,
                        images: [newImage]
                    }
                });
            }
        }

        console.log('✅ Image paths updated successfully');
    } catch (error) {
        console.error('❌ Error during update:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixPaths();
