export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  featured?: boolean;
  description?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Elixir de Jeunesse",
    category: "Serum",
    price: 385,
    image: "/images/elixir.jpg",
    rating: 5,
    featured: true,
    description: "A transcendent fusion of rare botanicals and cutting-edge science, crafted to unveil your skin's innate luminosity."
  },
  {
    id: 2,
    name: "Luminous Night Cream",
    category: "Moisturizer",
    price: 285,
    image: "/images/night-cream.jpg",
    rating: 5,
    description: "Deeply hydrates and nourishes your skin while you sleep, awakening to a radiant, refreshed complexion."
  },
  {
    id: 3,
    name: "Radiance Cleansing Oil",
    category: "Cleanser",
    price: 195,
    image: "/images/cleansing-oil.jpg",
    rating: 5,
    description: "Gentle yet effective cleansing oil that removes impurities while maintaining your skin's natural moisture barrier."
  },
  {
    id: 4,
    name: "Botanical Eye Elixir",
    category: "Eye Care",
    price: 245,
    image: "/images/eye-elixir.jpg",
    rating: 5,
    description: "Targeted treatment for the delicate eye area, reducing fine lines and dark circles with botanical extracts."
  },
  {
    id: 5,
    name: "Golden Radiance Serum",
    category: "Serum",
    price: 320,
    image: "/images/golden-serum.jpg",
    rating: 5,
    description: "Infused with 24K gold particles and rare botanical extracts for ultimate luminosity and skin renewal."
  },
  {
    id: 6,
    name: "Luxury Face Mask",
    category: "Treatment",
    price: 165,
    image: "/images/face-mask.jpg",
    rating: 5,
    description: "Weekly intensive treatment mask that revitalizes and rejuvenates your skin with premium ingredients."
  },
  {
    id: 7,
    name: "Essence Toner",
    category: "Toner",
    price: 175,
    image: "/images/toner.jpg",
    rating: 5,
    description: "Refining essence that balances pH levels and prepares your skin for optimal product absorption."
  }
];

