import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');

export function initializeData() {
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Initialize products.json
  const productsPath = path.join(dataDir, 'products.json');
  if (!fs.existsSync(productsPath)) {
    const initialProducts = [
      {
        id: 1,
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
        id: 2,
        name: "Luminous Night Cream",
        category: "Moisturizer",
        price: 285,
        image: "/images/WhatsApp Image 2026-01-09 at 12.29.01 (1).jpeg",
        images: ["/images/WhatsApp Image 2026-01-09 at 12.29.01 (1).jpeg"],
        rating: 5,
        description: "Deeply hydrates and nourishes your skin while you sleep, awakening to a radiant, refreshed complexion."
      },
      {
        id: 3,
        name: "Radiance Cleansing Oil",
        category: "Cleanser",
        price: 195,
        image: "/images/WhatsApp Image 2026-01-09 at 12.29.01 (2).jpeg",
        images: ["/images/WhatsApp Image 2026-01-09 at 12.29.01 (2).jpeg"],
        rating: 5,
        description: "Gentle yet effective cleansing oil that removes impurities while maintaining your skin's natural moisture barrier."
      },
      {
        id: 4,
        name: "Botanical Eye Elixir",
        category: "Eye Care",
        price: 245,
        image: "/images/WhatsApp Image 2026-01-09 at 12.29.01 (3).jpeg",
        images: ["/images/WhatsApp Image 2026-01-09 at 12.29.01 (3).jpeg"],
        rating: 5,
        description: "Targeted treatment for the delicate eye area, reducing fine lines and dark circles with botanical extracts."
      },
      {
        id: 5,
        name: "Golden Radiance Serum",
        category: "Serum",
        price: 320,
        image: "/images/WhatsApp Image 2026-01-09 at 12.28.59.jpeg",
        images: ["/images/WhatsApp Image 2026-01-09 at 12.28.59.jpeg"],
        rating: 5,
        description: "Infused with 24K gold particles and rare botanical extracts for ultimate luminosity and skin renewal."
      },
      {
        id: 6,
        name: "Luxury Face Mask",
        category: "Treatment",
        price: 165,
        image: "/images/WhatsApp Image 2026-01-09 at 12.28.59 (1).jpeg",
        images: ["/images/WhatsApp Image 2026-01-09 at 12.28.59 (1).jpeg"],
        rating: 5,
        description: "Weekly intensive treatment mask that revitalizes and rejuvenates your skin with premium ingredients."
      },
      {
        id: 7,
        name: "Essence Toner",
        category: "Toner",
        price: 175,
        image: "/images/WhatsApp Image 2026-01-09 at 12.28.59 (2).jpeg",
        images: ["/images/WhatsApp Image 2026-01-09 at 12.28.59 (2).jpeg"],
        rating: 5,
        description: "Refining essence that balances pH levels and prepares your skin for optimal product absorption."
      }
    ];
    fs.writeFileSync(productsPath, JSON.stringify(initialProducts, null, 2));
  }

  // Initialize orders.json
  const ordersPath = path.join(dataDir, 'orders.json');
  if (!fs.existsSync(ordersPath)) {
    fs.writeFileSync(ordersPath, JSON.stringify([], null, 2));
  }

  // Initialize franchise.json
  const franchisePath = path.join(dataDir, 'franchise.json');
  if (!fs.existsSync(franchisePath)) {
    fs.writeFileSync(franchisePath, JSON.stringify([], null, 2));
  }

  // Initialize customers.json
  const customersPath = path.join(dataDir, 'customers.json');
  if (!fs.existsSync(customersPath)) {
    fs.writeFileSync(customersPath, JSON.stringify([], null, 2));
  }

  // Create uploads directory
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}
