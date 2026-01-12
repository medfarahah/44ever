import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Plus, Edit, Trash2, Image as ImageIcon, Upload, X } from "lucide-react";
import { productsAPI } from "../../services/api";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Product } from "../../data/products";
import { useAdminAuth } from "../../context/AdminAuthContext";

export function ProductsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<Array<{ file: File; preview: string; error?: boolean }>>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    featured: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxImages = 4;

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsAPI.getAll();
        console.log('Admin: Products fetched:', data.length, 'products');
        data.forEach((product, idx) => {
          console.log(`Admin Product ${idx + 1}:`, {
            id: product.id,
            name: product.name,
            image: product.image?.substring(0, 50) + '...',
            hasImage: !!product.image,
            imagesCount: product.images?.length || 0,
            images: product.images?.map(img => img.substring(0, 30) + '...') || []
          });
        });
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Open add modal if coming from sidebar "Add Product" link
  useEffect(() => {
    if (location.pathname === "/admin/products/add") {
      setShowAddModal(true);
    }
  }, [location.pathname]);

  // Cleanup blob URLs when component unmounts
  useEffect(() => {
    return () => {
      productImages.forEach(img => {
        if (img.preview && img.preview.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, []); // Only run on unmount

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const files = input.files;

    if (!files || files.length === 0) {
      return;
    }

    const fileArray = Array.from(files);
    const remainingSlots = maxImages - productImages.length;
    const filesToAdd = fileArray.slice(0, remainingSlots);

    // Validate file types and sizes
    const validFiles: File[] = [];
    for (const file of filesToAdd) {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

      if (!isValidType) {
        alert(`${file.name} is not a valid image file.`);
        continue;
      }
      if (!isValidSize) {
        alert(`${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }
      validFiles.push(file);
    }

    // Create preview URLs immediately using URL.createObjectURL
    const newImages = validFiles.map(file => {
      const preview = URL.createObjectURL(file);
      return {
        file,
        preview,
        error: false
      };
    });

    // Add new images to state
    setProductImages(prev => {
      // Filter out duplicates by file name
      const existingNames = new Set(prev.map(img => img.file.name));
      const uniqueNewImages = newImages.filter(img => !existingNames.has(img.file.name));
      return [...prev, ...uniqueNewImages];
    });

    // Reset input to allow selecting the same file again
    if (input) {
      input.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setProductImages((prev) => {
      const imageToRemove = prev[index];
      // Clean up object URL to prevent memory leaks
      if (imageToRemove && imageToRemove.preview && imageToRemove.preview.startsWith('blob:')) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleClearAllImages = () => {
    setProductImages((prev) => {
      // Clean up all object URLs to prevent memory leaks
      prev.forEach(img => {
        if (img.preview && img.preview.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });
      return [];
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2A26] mb-2">Products</h1>
          <p className="text-sm text-[#5C5852]">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#A88B5C] text-white rounded-lg hover:bg-[#8F7A52] transition-colors text-sm"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border border-[#A88B5C]/10 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5852]" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12 text-[#5C5852]">Loading products...</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-[#A88B5C]/10 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-[#F5F5F5] overflow-hidden relative">
                <ImageWithFallback
                  src={product.image || product.images?.[0] || '/images/default-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  fallback={
                    <div className="w-full h-full flex items-center justify-center bg-[#F5F5F5]">
                      <ImageIcon className="text-[#A88B5C]/30" size={48} />
                      <p className="text-xs text-[#5C5852] mt-2 ml-2">No image</p>
                    </div>
                  }
                  onError={(e) => {
                    console.error('Admin product image failed to load:', {
                      productId: product.id,
                      productName: product.name,
                      imageSrc: product.image,
                      images: product.images
                    });
                  }}
                />
                {product.featured && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-[#A88B5C] text-white text-xs rounded">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="text-xs text-[#A88B5C] mb-1">{product.category}</div>
                <h3 className="font-medium text-[#2D2A26] mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-bold text-[#A88B5C]">${product.price}</div>
                  {product.featured && (
                    <span className="px-2 py-1 text-xs bg-[#A88B5C] text-white rounded">Featured</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setFormData({
                        name: product.name,
                        category: product.category,
                        price: product.price.toString(),
                        description: "", // Description not in product data yet
                        featured: product.featured || false
                      });
                      // For editing, use existing image URL (not a File object)
                      setProductImages(product.images && product.images.length > 0
                        ? product.images.map((imgUrl, idx) => ({
                          file: new File([], `existing-image-${idx}.jpg`),
                          preview: imgUrl,
                          error: false
                        }))
                        : [{
                          file: new File([], "existing-image.jpg"),
                          preview: product.image,
                          error: false
                        }]
                      );
                    }}
                    className="flex-1 px-3 py-2 border border-[#A88B5C] text-[#A88B5C] rounded hover:bg-[#A88B5C] hover:text-white transition-colors text-sm flex items-center justify-center gap-1"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                        try {
                          await productsAPI.delete(product.id);
                          // Refresh products list
                          const data = await productsAPI.getAll();
                          setProducts(data);
                          alert("Product deleted successfully!");
                        } catch (error: any) {
                          console.error("Failed to delete product:", error);
                          const errorMessage = error?.message || error?.error || "Failed to delete product. Please try again.";
                          alert(errorMessage);
                        }
                      }
                    }}
                    className="px-3 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#2D2A26]">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                  handleClearAllImages();
                  setFormData({ name: "", category: "", price: "", description: "", featured: false });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();

                // Check admin authentication
                if (!isAuthenticated) {
                  alert("You must be logged in as admin to add products. Redirecting to login...");
                  navigate("/admin/login");
                  return;
                }

                // Check if admin token exists
                const adminToken = localStorage.getItem('adminToken');
                if (!adminToken) {
                  alert("Admin session expired. Please log in again.");
                  navigate("/admin/login");
                  return;
                }

                try {
                  // Validate required fields
                  if (!formData.name || !formData.category || !formData.price) {
                    alert("Please fill in all required fields (Name, Category, Price)");
                    return;
                  }

                  // Validate price
                  const priceValue = parseFloat(formData.price);
                  if (isNaN(priceValue) || priceValue <= 0) {
                    alert("Please enter a valid price (greater than 0)");
                    return;
                  }

                  // Convert images to base64 for submission
                  // If preview is a blob URL, convert the File to base64
                  // If preview is already a URL or base64, use it directly
                  const convertImageToBase64 = (file: File): Promise<string> => {
                    return new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result as string);
                      reader.onerror = reject;
                      reader.readAsDataURL(file);
                    });
                  };

                  const imagePromises = productImages.map(async (img) => {
                    // If preview is a blob URL and we have a File, convert to base64
                    if (img.preview.startsWith('blob:') && img.file) {
                      return await convertImageToBase64(img.file);
                    }
                    // Otherwise use the preview as-is (URL or existing base64)
                    return img.preview;
                  });

                  let images = await Promise.all(imagePromises);

                  // Filter out invalid images
                  images = images.filter((src) => {
                    const isValid = src && typeof src === 'string' && src.trim() !== '';
                    if (!isValid) {
                      console.warn('Filtered out invalid image source');
                    }
                    return isValid;
                  });

                  // Ensure at least one image
                  if (images.length === 0) {
                    alert("Please add at least one product image. Click 'Upload Images' to add images.");
                    return;
                  }

                  console.log('Final images array to send:', images);

                  const payload = {
                    name: formData.name.trim(),
                    category: formData.category.trim(),
                    price: priceValue,
                    description: formData.description?.trim() || '',
                    featured: formData.featured || false,
                    images: images.length > 0 ? images : ['/images/default-product.jpg'],
                  };

                  console.log('Creating product with payload:', { ...payload, images: images.length });

                  if (editingProduct) {
                    // Update existing product
                    const result = await productsAPI.update(editingProduct.id, payload);
                    console.log('Product updated:', result);
                    alert("Product updated successfully!");
                  } else {
                    // Create new product
                    const result = await productsAPI.create(payload);
                    console.log('Product created:', result);
                    alert("Product added successfully!");
                  }

                  // Refresh products list
                  const data = await productsAPI.getAll();
                  setProducts(data);

                  setShowAddModal(false);
                  setEditingProduct(null);
                  handleClearAllImages();
                  setFormData({
                    name: "",
                    category: "",
                    price: "",
                    description: "",
                    featured: false,
                  });
                } catch (error: any) {
                  console.error("Failed to save product:", error);
                  console.error("Full error object:", error);

                  let errorMessage = 'Unknown error occurred';

                  if (error?.message) {
                    errorMessage = error.message;
                  } else if (error?.error) {
                    errorMessage = error.error;
                  } else if (typeof error === 'string') {
                    errorMessage = error;
                  }

                  // Check for specific error types
                  if (errorMessage.includes('401') || errorMessage.includes('Access token')) {
                    errorMessage = 'Authentication failed. Please log in again as admin.';
                  } else if (errorMessage.includes('403') || errorMessage.includes('Admin access')) {
                    errorMessage = 'Admin access required. Please log in as admin.';
                  } else if (errorMessage.includes('Cannot connect')) {
                    errorMessage = 'Cannot connect to server. Please check if the backend is running.';
                  } else if (errorMessage.includes('Missing required')) {
                    errorMessage = 'Please fill in all required fields (Name, Category, Price).';
                  } else if (errorMessage.includes('Invalid price')) {
                    errorMessage = 'Please enter a valid price (must be a positive number).';
                  }

                  console.error("Error details:", {
                    message: errorMessage,
                    originalError: error,
                    stack: error?.stack,
                    response: error?.response,
                    code: error?.code
                  });

                  alert(`Failed to save product: ${errorMessage}\n\nPlease check the browser console (F12) for more details.`);
                }
              }}
            >
              {/* Product Images Upload */}
              <div>
                <label className="block text-sm text-[#2D2A26] mb-2">
                  Product Images ({productImages.length}/{maxImages})
                </label>

                {/* Image URL Input */}
                <div className="mb-4 p-3 bg-[#FFF8E7]/30 rounded-lg border border-[#A88B5C]/20">
                  <label className="block text-sm font-medium text-[#2D2A26] mb-2">
                    📎 Add Images by URL
                  </label>
                  <div className="flex gap-2">
                    <textarea
                      id="image-url-input"
                      placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                      rows={3}
                      className="flex-1 px-3 py-2 border border-[#A88B5C]/30 rounded-lg focus:outline-none focus:border-[#A88B5C] text-sm resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById('image-url-input') as HTMLTextAreaElement;
                        const urls = textarea.value
                          .split('\n')
                          .map(url => url.trim())
                          .filter(url => {
                            const isValid = url && (
                              url.startsWith('http://') ||
                              url.startsWith('https://') ||
                              url.startsWith('/') ||
                              url.startsWith('data:image/')
                            );
                            if (!isValid && url) {
                              console.warn('Invalid URL format:', url);
                            }
                            return isValid;
                          });

                        if (urls.length === 0) {
                          alert('Please enter valid image URLs (one per line).\n\nURLs should start with:\n- http:// or https://\n- / (for local paths)\n- data:image/ (for base64)');
                          return;
                        }

                        const remainingSlots = maxImages - productImages.length;
                        if (urls.length > remainingSlots) {
                          alert(`You can only add ${remainingSlots} more image(s). You entered ${urls.length}.`);
                          return;
                        }

                        const newImages = urls
                          .slice(0, remainingSlots)
                          .map(url => ({
                            preview: url,
                            error: false,
                            loading: false // Start as false, will show loading if needed
                          }));

                        setProductImages(prev => {
                          const updated = [...prev, ...newImages];
                          console.log('Updated product images:', updated);
                          return updated;
                        });
                        textarea.value = '';
                        console.log(`Added ${newImages.length} image(s) from URLs:`, newImages);
                      }}
                      className="px-4 py-2 bg-[#A88B5C] text-white rounded-lg hover:bg-[#8B6F47] transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      Add URLs
                    </button>
                  </div>
                  <p className="text-xs text-[#5C5852] mt-2">
                    💡 Paste image URLs (one per line) or upload files below. Supports http://, https://, / (local), or data:image/ (base64)
                  </p>
                </div>

                {/* Image Grid */}
                {productImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {productImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="w-full aspect-square rounded-lg overflow-hidden border border-[#A88B5C]/20 bg-[#F5F5F5]">
                          {image.error ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[#5C5852] p-2">
                              <ImageIcon size={24} className="mb-2" />
                              <p className="text-xs text-center text-red-600">
                                Failed to load
                              </p>
                            </div>
                          ) : image.preview ? (
                            <img
                              src={image.preview}
                              alt={`Product preview ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={() => {
                                setProductImages((prev) =>
                                  prev.map((img, i) =>
                                    i === index ? { ...img, error: true } : img
                                  )
                                );
                              }}
                            />
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
                          title="Remove image"
                        >
                          <X size={14} />
                        </button>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded font-medium">
                          {index === 0 ? "Main" : `#${index + 1}`}
                        </div>
                        {image.file && (
                          <p className="text-xs text-[#5C5852] mt-1 truncate px-1" title={image.file.name}>
                            {image.file.name}
                          </p>
                        )}
                        {!image.file && image.preview && (
                          <p className="text-xs text-[#5C5852] mt-1 truncate px-1" title={image.preview}>
                            {image.preview.startsWith('data:') ? 'Base64 Image' : image.preview.length > 30 ? image.preview.substring(0, 30) + '...' : image.preview}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Area */}
                {productImages.length < maxImages && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full border-2 border-dashed border-[#A88B5C]/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#A88B5C] hover:bg-[#FFF8E7]/50 transition-colors ${productImages.length === 0 ? 'h-48' : 'h-32'
                      }`}
                  >
                    <Upload className="text-[#A88B5C] mb-2" size={productImages.length === 0 ? 32 : 24} />
                    <p className="text-sm text-[#5C5852] mb-1">
                      {productImages.length === 0
                        ? "Click to upload images"
                        : `Add more images (${maxImages - productImages.length} remaining)`}
                    </p>
                    <p className="text-xs text-[#5C5852]">
                      PNG, JPG, WEBP up to 10MB each
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>
                )}

                {productImages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllImages}
                    className="mt-2 text-xs text-red-600 hover:text-red-700 transition-colors"
                  >
                    Clear all images
                  </button>
                )}

                {productImages.length >= maxImages && (
                  <p className="text-xs text-[#5C5852] mt-2">
                    Maximum {maxImages} images reached. Remove an image to add more.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-[#2D2A26] mb-2">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm text-[#2D2A26] mb-2">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
                >
                  <option value="">Select category</option>
                  <option value="Serum">Serum</option>
                  <option value="Moisturizer">Moisturizer</option>
                  <option value="Cleanser">Cleanser</option>
                  <option value="Eye Care">Eye Care</option>
                  <option value="Treatment">Treatment</option>
                  <option value="Toner">Toner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#2D2A26] mb-2">Price *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm text-[#2D2A26] mb-2">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C] resize-none"
                  placeholder="Enter product description"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-[#A88B5C] border-[#A88B5C]/20 rounded focus:ring-[#A88B5C]"
                />
                <label htmlFor="featured" className="text-sm text-[#2D2A26]">
                  Mark as featured product
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                    handleClearAllImages();
                    setFormData({ name: "", category: "", price: "", description: "", featured: false });
                  }}
                  className="flex-1 px-4 py-2 border border-[#A88B5C] text-[#A88B5C] rounded-lg hover:bg-[#A88B5C] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#A88B5C] text-white rounded-lg hover:bg-[#8F7A52] transition-colors"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

