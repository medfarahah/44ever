import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Search, Plus, Edit, Trash2, Image as ImageIcon, Upload, X } from "lucide-react";
import { productsAPI } from "../../services/api";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Product } from "../../data/products";

export function ProductsPage() {
  const location = useLocation();
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = maxImages - productImages.length;
    const filesToAdd = files.slice(0, remainingSlots);

    // Validate file types and sizes
    const validFiles = filesToAdd.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      if (!isValidType) {
        alert(`${file.name} is not a valid image file.`);
      }
      if (!isValidSize) {
        alert(`${file.name} is too large. Maximum size is 10MB.`);
      }
      return isValidType && isValidSize;
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onerror = () => {
        alert(`Failed to load image: ${file.name}`);
        setProductImages((prev) => [
          ...prev,
          { file, preview: "", error: true },
        ]);
      };

      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          setProductImages((prev) => {
            // Check if this file is already in the list
            if (prev.some(img => img.file === file)) {
              return prev;
            }
            return [
              ...prev,
              { file, preview: result as string, error: false },
            ];
          });
        }
      };

      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAllImages = () => {
    setProductImages([]);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-[#A88B5C]/10 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-square bg-[#F5F5F5] overflow-hidden relative">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="text-[#A88B5C]/30" size={48} />
                  </div>
                }
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
                    setProductImages([{
                      file: new File([], "existing-image.jpg"),
                      preview: product.image,
                      error: false
                    }]);
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
                        const data = await productsAPI.getAll();
                        setProducts(data);
                        alert("Product deleted successfully!");
                      } catch (error) {
                        console.error("Failed to delete product:", error);
                        alert("Failed to delete product. Please try again.");
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
                try {
                  const formDataToSend = new FormData();
                  formDataToSend.append('name', formData.name);
                  formDataToSend.append('category', formData.category);
                  formDataToSend.append('price', formData.price);
                  formDataToSend.append('description', formData.description);
                  formDataToSend.append('featured', formData.featured.toString());
                  
                  // Add images
                  productImages.forEach((img) => {
                    if (img.file && img.file.size > 0) {
                      formDataToSend.append('images', img.file);
                    }
                  });

                  if (editingProduct) {
                    // Update existing product
                    const existingImages = productImages
                      .filter(img => !img.file || img.file.size === 0)
                      .map(img => img.preview);
                    formDataToSend.append('existingImages', JSON.stringify(existingImages));
                    
                    await productsAPI.update(editingProduct.id, formDataToSend);
                    alert("Product updated successfully!");
                  } else {
                    // Create new product
                    await productsAPI.create(formDataToSend);
                    alert("Product added successfully!");
                  }
                  
                  // Refresh products list
                  const data = await productsAPI.getAll();
                  setProducts(data);
                  
                  setShowAddModal(false);
                  setEditingProduct(null);
                  handleClearAllImages();
                  setFormData({ name: "", category: "", price: "", description: "", featured: false });
                } catch (error) {
                  console.error("Failed to save product:", error);
                  alert("Failed to save product. Please try again.");
                }
              }}
            >
              {/* Product Images Upload */}
              <div>
                <label className="block text-sm text-[#2D2A26] mb-2">
                  Product Images ({productImages.length}/{maxImages})
                </label>

                {/* Image Grid */}
                {productImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {productImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="w-full aspect-square rounded-lg overflow-hidden border border-[#A88B5C]/20 bg-[#F5F5F5]">
                          {image.error || !image.preview ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[#5C5852] p-2">
                              <ImageIcon size={24} className="mb-2" />
                              <p className="text-xs text-center">
                                {image.error ? "Failed to load" : "Loading..."}
                              </p>
                            </div>
                          ) : (
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
                          )}
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
                        <p className="text-xs text-[#5C5852] mt-1 truncate px-1" title={image.file.name}>
                          {image.file.name}
                        </p>
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

