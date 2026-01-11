import prisma from './connection.js';

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
          image: "/images/WhatsApp Image 2026-01-09 at 12.29.01.jpeg",
          images: ["/images/WhatsApp Image 2026-01-09 at 12.29.01.jpeg"],
          rating: 5,
          featured: true,
          description: "A transcendent fusion of rare botanicals and cutting-edge science, crafted to unveil your skin's innate luminosity."
        },
        {
          name: "Luminous Night Cream",
          category: "Moisturizer",
          price: 285,
          image: "/images/WhatsApp Image 2026-01-09 at 12.29.01 (1).jpeg",
          images: ["/images/WhatsApp Image 2026-01-09 at 12.29.01 (1).jpeg"],
          rating: 5,
          description: "Deeply hydrates and nourishes your skin while you sleep, awakening to a radiant, refreshed complexion."
        },
        {
          name: "Radiance Cleansing Oil",
          category: "Cleanser",
          price: 195,
          image: "/images/WhatsApp Image 2026-01-09 at 12.29.01 (2).jpeg",
          images: ["/images/WhatsApp Image 2026-01-09 at 12.29.01 (2).jpeg"],
          rating: 5,
          description: "Gentle yet effective cleansing oil that removes impurities while maintaining your skin's natural moisture barrier."
        },
        {
          name: "Botanical Eye Elixir",
          category: "Eye Care",
          price: 245,
          image: "/images/WhatsApp Image 2026-01-09 at 12.29.01 (3).jpeg",
          images: ["/images/WhatsApp Image 2026-01-09 at 12.29.01 (3).jpeg"],
          rating: 5,
          description: "Targeted treatment for the delicate eye area, reducing fine lines and dark circles with botanical extracts."
        },
        {
          name: "Golden Radiance Serum",
          category: "Serum",
          price: 320,
          image: "/images/WhatsApp Image 2026-01-09 at 12.28.59.jpeg",
          images: ["/images/WhatsApp Image 2026-01-09 at 12.28.59.jpeg"],
          rating: 5,
          description: "Infused with 24K gold particles and rare botanical extracts for ultimate luminosity and skin renewal."
        },
        {
          name: "Luxury Face Mask",
          category: "Treatment",
          price: 165,
          image: "/images/WhatsApp Image 2026-01-09 at 12.28.59 (1).jpeg",
          images: ["/images/WhatsApp Image 2026-01-09 at 12.28.59 (1).jpeg"],
          rating: 5,
          description: "Weekly intensive treatment mask that revitalizes and rejuvenates your skin with premium ingredients."
        },
        {
          name: "Essence Toner",
          category: "Toner",
          price: 175,
          image: "/images/WhatsApp Image 2026-01-09 at 12.28.59 (2).jpeg",
          images: ["/images/WhatsApp Image 2026-01-09 at 12.28.59 (2).jpeg"],
          rating: 5,
          description: "Refining essence that balances pH levels and prepares your skin for optimal product absorption."
        }
      ];

      await prisma.product.createMany({
        data: initialProducts
      });
      
      console.log('✅ Initial products seeded successfully');
    }

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
