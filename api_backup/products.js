import prisma from '../server/database/connection.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper to verify token
function verifyToken(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return null;
  
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const { method } = req;

  try {
    // GET all products (public)
    if (method === 'GET') {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
      });
      
      const productsWithImages = products.map(p => {
        // Ensure image field is always set
        const mainImage = p.image || (p.images && p.images.length > 0 ? p.images[0] : '/images/default-product.jpg');
        const imagesArray = p.images && p.images.length > 0 ? p.images : [mainImage];
        
        console.log(`Product ${p.id} (${p.name}):`, {
          image: mainImage,
          imagesCount: imagesArray.length,
          hasImage: !!mainImage && mainImage !== '/images/default-product.jpg'
        });
        
        return {
          ...p,
          image: mainImage,  // Ensure image field is always present
          images: imagesArray,
          price: parseFloat(p.price.toString())
        };
      });
      
      console.log(`Returning ${productsWithImages.length} products with images`);
      return res.json(productsWithImages);
    }

    // POST, PUT, DELETE require authentication
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Access token required' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // POST create product (admin only)
    if (method === 'POST') {
      const { name, category, price, description, featured, images } = req.body;
      
      // Validate required fields
      if (!name || !category || price === undefined || price === null) {
        return res.status(400).json({ 
          error: 'Missing required fields', 
          message: 'Name, category, and price are required' 
        });
      }

      // Validate price
      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) {
        return res.status(400).json({ 
          error: 'Invalid price', 
          message: 'Price must be a positive number' 
        });
      }

      // Ensure images array exists and has at least one image
      let imageArray = [];
      if (images && Array.isArray(images) && images.length > 0) {
        imageArray = images
          .filter(img => img && typeof img === 'string' && img.trim() !== '')
          .map(img => img.trim());
      }
      
      // If no images provided, use default
      if (imageArray.length === 0) {
        imageArray = ['/images/default-product.jpg'];
      }

      // Ensure we have a valid main image
      const mainImage = imageArray[0] || '/images/default-product.jpg';
      
      console.log('Creating product with images:', {
        imageCount: imageArray.length,
        mainImage: mainImage.substring(0, 50) + (mainImage.length > 50 ? '...' : ''),
        allImages: imageArray.map(img => img.substring(0, 30) + '...')
      });

      const product = await prisma.product.create({
        data: {
          name: name.trim(),
          category: category.trim(),
          price: priceValue,
          image: mainImage,  // Ensure main image is set
          images: imageArray, // All images array
          rating: 5,
          featured: featured === true || featured === 'true',
          description: description ? description.trim() : ''
        }
      });
      
      console.log('Product created successfully:', {
        id: product.id,
        name: product.name,
        image: product.image,
        imagesCount: product.images.length
      });
      
      return res.status(201).json({
        ...product,
        price: parseFloat(product.price.toString()),
        images: product.images.length > 0 ? product.images : [product.image]
      });
    }

    // PUT and DELETE are handled by api/products/[id].js
    // This file only handles GET (all) and POST (create)

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Products API error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Duplicate entry', message: 'A product with this name already exists' });
    }
    
    // Return detailed error for debugging
    res.status(500).json({ 
      error: 'Request failed', 
      message: error.message,
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
