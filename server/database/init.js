import prisma from './connection.js';
import bcrypt from 'bcryptjs';

async function initializeDatabase() {
  try {
    // Test database connection first
    await prisma.$connect();
    console.log('✅ Database connection established');

    // Check if products table is empty, then seed initial data
    const productCount = await prisma.product.count();

    if (productCount === 0) {
      console.log('📦 Seeding initial products...');

      const initialProducts = [
        {
          name: "Elixir de Jeunesse",
          category: "Serum",
          price: 385,
          image: "/images/elixir.jpg",
          images: ["/images/elixir.jpg"],
          rating: 5,
          featured: true,
          description: "A transcendent fusion of rare botanicals and cutting-edge science, crafted to unveil your skin's innate luminosity."
        },
        {
          name: "Luminous Night Cream",
          category: "Moisturizer",
          price: 285,
          image: "/images/night-cream.jpg",
          images: ["/images/night-cream.jpg"],
          rating: 5,
          featured: true,
          description: "Deeply hydrates and nourishes your skin while you sleep, awakening to a radiant, refreshed complexion."
        },
        {
          name: "Radiance Cleansing Oil",
          category: "Cleanser",
          price: 195,
          image: "/images/cleansing-oil.jpg",
          images: ["/images/cleansing-oil.jpg"],
          rating: 5,
          description: "Gentle yet effective cleansing oil that removes impurities while maintaining your skin's natural moisture barrier."
        },
        {
          name: "Botanical Eye Elixir",
          category: "Eye Care",
          price: 245,
          image: "/images/eye-elixir.jpg",
          images: ["/images/eye-elixir.jpg"],
          rating: 5,
          description: "Targeted treatment for the delicate eye area, reducing fine lines and dark circles with botanical extracts."
        },
        {
          name: "Golden Radiance Serum",
          category: "Serum",
          price: 320,
          image: "/images/golden-serum.jpg",
          images: ["/images/golden-serum.jpg"],
          rating: 5,
          featured: true,
          description: "Infused with 24K gold particles and rare botanical extracts for ultimate luminosity and skin renewal."
        },
        {
          name: "Luxury Face Mask",
          category: "Treatment",
          price: 165,
          image: "/images/face-mask.jpg",
          images: ["/images/face-mask.jpg"],
          rating: 5,
          description: "Weekly intensive treatment mask that revitalizes and rejuvenates your skin with premium ingredients."
        },
        {
          name: "Essence Toner",
          category: "Toner",
          price: 175,
          image: "/images/toner.jpg",
          images: ["/images/toner.jpg"],
          rating: 5,
          description: "Refining essence that balances pH levels and prepares your skin for optimal product absorption."
        }
      ];

      await prisma.product.createMany({
        data: initialProducts
      });

      console.log('✅ Initial products seeded successfully');
    }

    // Demo data seeding removed - only products are seeded
    // Customers, orders, and franchise applications will be created by users

    console.log('✅ Database initialization complete');
  } catch (error) {
    // Don't throw - let server start even if database init fails
    console.error('⚠️ Database initialization error:', error.message || error);
    console.error('Server will continue, but database operations may fail.');
    // Don't throw - server should start even without database
  }
}

// Run initialization if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => {
      console.log('✅ Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default initializeDatabase;
