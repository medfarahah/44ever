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
          featured: true,
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
          featured: true,
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

    // Seed sample customers if none exist
    const customerCount = await prisma.customer.count();
    if (customerCount === 0) {
      console.log('👥 Seeding sample customers...');
      
      const sampleCustomers = [
        {
          name: "Sophia Laurent",
          email: "sophia.laurent@example.com",
          phone: "+1 (555) 123-4567",
          address: {
            street: "123 Luxury Avenue",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "United States"
          }
        },
        {
          name: "Isabella Chen",
          email: "isabella.chen@example.com",
          phone: "+1 (555) 234-5678",
          address: {
            street: "456 Beauty Boulevard",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90001",
            country: "United States"
          }
        },
        {
          name: "Amélie Dubois",
          email: "amelie.dubois@example.com",
          phone: "+1 (555) 345-6789",
          address: {
            street: "789 Elegance Street",
            city: "Paris",
            state: "Île-de-France",
            zipCode: "75001",
            country: "France"
          }
        },
        {
          name: "Emma Wilson",
          email: "emma.wilson@example.com",
          phone: "+1 (555) 456-7890",
          address: {
            street: "321 Radiance Road",
            city: "London",
            state: "England",
            zipCode: "SW1A 1AA",
            country: "United Kingdom"
          }
        },
        {
          name: "Olivia Brown",
          email: "olivia.brown@example.com",
          phone: "+1 (555) 567-8901",
          address: {
            street: "654 Glow Gardens",
            city: "Toronto",
            state: "Ontario",
            zipCode: "M5H 2N2",
            country: "Canada"
          }
        }
      ];

      await prisma.customer.createMany({
        data: sampleCustomers
      });
      
      console.log('✅ Sample customers seeded successfully');
    }

    // Seed sample orders if none exist
    const orderCount = await prisma.order.count();
    if (orderCount === 0 && customerCount > 0) {
      console.log('📦 Seeding sample orders...');
      
      // Get products and customers for orders
      const products = await prisma.product.findMany();
      const customers = await prisma.customer.findMany();
      
      if (products.length > 0 && customers.length > 0) {
        const sampleOrders = [
          {
            orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            customerId: customers[0].id,
            items: [
              {
                id: products[0].id,
                name: products[0].name,
                price: parseFloat(products[0].price.toString()),
                quantity: 1,
                image: products[0].image
              }
            ],
            shipping: {
              firstName: customers[0].name.split(' ')[0],
              lastName: customers[0].name.split(' ')[1] || '',
              email: customers[0].email,
              phone: customers[0].phone,
              address: customers[0].address.street || '',
              city: customers[0].address.city || '',
              state: customers[0].address.state || '',
              zipCode: customers[0].address.zipCode || '',
              country: customers[0].address.country || ''
            },
            payment: {
              method: "card",
              cardLast4: "4242",
              billingAddress: customers[0].address
            },
            total: parseFloat(products[0].price.toString()),
            status: "Completed"
          },
          {
            orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            customerId: customers[1].id,
            items: [
              {
                id: products[1].id,
                name: products[1].name,
                price: parseFloat(products[1].price.toString()),
                quantity: 2,
                image: products[1].image
              },
              {
                id: products[2].id,
                name: products[2].name,
                price: parseFloat(products[2].price.toString()),
                quantity: 1,
                image: products[2].image
              }
            ],
            shipping: {
              firstName: customers[1].name.split(' ')[0],
              lastName: customers[1].name.split(' ')[1] || '',
              email: customers[1].email,
              phone: customers[1].phone,
              address: customers[1].address.street || '',
              city: customers[1].address.city || '',
              state: customers[1].address.state || '',
              zipCode: customers[1].address.zipCode || '',
              country: customers[1].address.country || ''
            },
            payment: {
              method: "card",
              cardLast4: "5678",
              billingAddress: customers[1].address
            },
            total: (parseFloat(products[1].price.toString()) * 2) + parseFloat(products[2].price.toString()),
            status: "Processing"
          },
          {
            orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            customerId: customers[2].id,
            items: [
              {
                id: products[3].id,
                name: products[3].name,
                price: parseFloat(products[3].price.toString()),
                quantity: 1,
                image: products[3].image
              }
            ],
            shipping: {
              firstName: customers[2].name.split(' ')[0],
              lastName: customers[2].name.split(' ')[1] || '',
              email: customers[2].email,
              phone: customers[2].phone,
              address: customers[2].address.street || '',
              city: customers[2].address.city || '',
              state: customers[2].address.state || '',
              zipCode: customers[2].address.zipCode || '',
              country: customers[2].address.country || ''
            },
            payment: {
              method: "card",
              cardLast4: "9012",
              billingAddress: customers[2].address
            },
            total: parseFloat(products[3].price.toString()),
            status: "Pending"
          }
        ];

        for (const order of sampleOrders) {
          await prisma.order.create({
            data: order
          });
        }
        
        console.log('✅ Sample orders seeded successfully');
      }
    }

    // Seed sample franchise applications if none exist
    const franchiseCount = await prisma.franchiseApplication.count();
    if (franchiseCount === 0) {
      console.log('🏢 Seeding sample franchise applications...');
      
      const sampleApplications = [
        {
          firstName: "James",
          lastName: "Mitchell",
          email: "james.mitchell@example.com",
          phone: "+1 (555) 111-2222",
          company: "Mitchell Beauty Group",
          location: "New York, NY",
          investmentRange: "$100,000 - $250,000",
          experience: "10+ years in retail and beauty industry. Currently own 3 successful beauty salons.",
          message: "Interested in expanding into luxury skincare. Have prime location in Manhattan.",
          status: "Pending",
          date: new Date()
        },
        {
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarah.johnson@example.com",
          phone: "+1 (555) 222-3333",
          company: "Johnson Enterprises",
          location: "Los Angeles, CA",
          investmentRange: "$250,000 - $500,000",
          experience: "15 years in business development. Background in luxury retail.",
          message: "Looking to bring Forever products to the West Coast market.",
          status: "Reviewing",
          date: new Date()
        },
        {
          firstName: "Michael",
          lastName: "Chen",
          email: "michael.chen@example.com",
          phone: "+1 (555) 333-4444",
          company: null,
          location: "San Francisco, CA",
          investmentRange: "$50,000 - $100,000",
          experience: "5 years in e-commerce and digital marketing.",
          message: "Interested in online franchise opportunity.",
          status: "Pending",
          date: new Date()
        }
      ];

      await prisma.franchiseApplication.createMany({
        data: sampleApplications
      });
      
      console.log('✅ Sample franchise applications seeded successfully');
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
