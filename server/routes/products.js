import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../uploads/products');
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed!'));
    }
  }
});

// Ensure uploads directory exists
import fs from 'fs';
const uploadsDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(products.map(p => ({
      ...p,
      price: parseFloat(p.price.toString()),
      images: p.images.length > 0 ? p.images : [p.image]
    })));
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      ...product,
      price: parseFloat(product.price.toString()),
      images: product.images.length > 0 ? product.images : [product.image]
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Helper to save base64 image
const saveBase64Image = (base64String) => {
  try {
    if (!base64String || !base64String.startsWith('data:image')) return null;

    const matches = base64String.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return null;

    const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const data = Buffer.from(matches[2], 'base64');
    const filename = `product-${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`;
    const filePath = path.join(uploadsDir, filename);

    console.log(`Saving base64 image to: ${filePath}`);
    fs.writeFileSync(filePath, data);
    console.log(`Successfully saved: ${filename}`);
    return `/uploads/products/${filename}`;
  } catch (error) {
    console.error('Error saving base64 image:', error);
    return null;
  }
};

// POST create product (admin only)
router.post('/', authenticateToken, upload.array('images', 4), async (req, res) => {
  try {
    const { name, category, price, description, featured } = req.body;
    let { images } = req.body;

    // Handle uploaded images (multipart/form-data)
    let imagePaths = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];

    // Handle images in body (JSON base64 or URLs)
    if (imagePaths.length === 0 && images) {
      if (typeof images === 'string') {
        try {
          images = JSON.parse(images);
        } catch (e) {
          images = [images];
        }
      }

      if (Array.isArray(images)) {
        for (const img of images) {
          if (img.startsWith('data:image')) {
            const savedPath = saveBase64Image(img);
            if (savedPath) imagePaths.push(savedPath);
          } else if (img.startsWith('http') || img.startsWith('/')) {
            imagePaths.push(img);
          }
        }
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        category,
        price: parseFloat(price),
        image: imagePaths[0] || '/images/default-product.jpg',
        images: imagePaths.length > 0 ? imagePaths : [imagePaths[0] || '/images/default-product.jpg'],
        rating: 5,
        featured: featured === 'true' || featured === true,
        description: description || ''
      }
    });

    res.status(201).json({
      ...product,
      price: parseFloat(product.price.toString()),
      images: product.images.length > 0 ? product.images : [product.image]
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product', message: error.message });
  }
});

// PUT update product (admin only)
router.put('/:id', authenticateToken, upload.array('images', 4), async (req, res) => {
  try {
    const { name, category, price, description, featured, existingImages } = req.body;
    let { images } = req.body;

    // Get existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Handle uploaded images (multipart/form-data)
    let newImagePaths = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];

    // Handle images in body (JSON base64 or URLs)
    if (newImagePaths.length === 0 && images) {
      if (typeof images === 'string') {
        try {
          images = JSON.parse(images);
        } catch (e) {
          images = [images];
        }
      }

      if (Array.isArray(images)) {
        for (const img of images) {
          if (img.startsWith('data:image')) {
            const savedPath = saveBase64Image(img);
            if (savedPath) newImagePaths.push(savedPath);
          } else if (img.startsWith('http') || img.startsWith('/')) {
            newImagePaths.push(img);
          }
        }
      }
    }

    // Combine existing and new images
    let imagePaths = [];
    if (existingImages) {
      try {
        const parsed = JSON.parse(existingImages);
        imagePaths = Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        imagePaths = existingProduct.images || [];
      }
    } else if (newImagePaths.length === 0) {
      imagePaths = existingProduct.images || [];
    }

    imagePaths = [...imagePaths, ...newImagePaths].slice(0, 4); // Max 4 images

    const updateData = {};
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (price) updateData.price = parseFloat(price);
    if (description !== undefined) updateData.description = description;
    if (featured !== undefined) updateData.featured = featured === 'true' || featured === true;

    if (imagePaths.length > 0) {
      updateData.image = imagePaths[0];
      updateData.images = imagePaths;
    }

    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });

    res.json({
      ...product,
      price: parseFloat(product.price.toString()),
      images: product.images.length > 0 ? product.images : [product.image]
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product', message: error.message });
  }
});

// DELETE product (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
