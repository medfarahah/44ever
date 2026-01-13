import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Plus, Edit, Trash2, Image as ImageIcon, Upload, X, Gift } from "lucide-react";
import { giftSetsAPI, GiftSet } from "../../services/api";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { SEO } from "../../components/SEO";

interface GiftSetImage {
  file?: File;
  preview: string;
  error?: boolean;
}

export function GiftSetsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGiftSet, setEditingGiftSet] = useState<GiftSet | null>(null);
  const [giftSetImages, setGiftSetImages] = useState<GiftSetImage[]>([]);
  const [giftSets, setGiftSets] = useState<GiftSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    featured: false,
    inStock: true,
    stockCount: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxImages = 4;

  // Fetch gift sets from API
  useEffect(() => {
    const fetchGiftSets = async () => {
      try {
        const data = await giftSetsAPI.getAll();
        setGiftSets(data);
      } catch (error) {
        console.error("Failed to fetch gift sets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGiftSets();
  }, []);

  // Open add modal if coming from sidebar "Add Gift Set" link
  useEffect(() => {
    if (location.pathname === "/admin/gift-sets/add") {
      setShowAddModal(true);
    }
  }, [location.pathname]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      giftSetImages.forEach(image => {
        if (image.preview.startsWith('blob:')) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [giftSetImages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = maxImages - giftSetImages.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const validFiles = filesToAdd.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    const newImages: GiftSetImage[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      error: false,
    }));

    setGiftSetImages((prev) => [...prev, ...newImages]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setGiftSetImages((prev) => {
      const imageToRemove = prev[index];
      if (imageToRemove?.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleClearAllImages = () => {
    giftSetImages.forEach(image => {
      if (image.preview.startsWith('blob:')) {
        URL.revokeObjectURL(image.preview);
      }
    });
    setGiftSetImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const filteredGiftSets = giftSets.filter(giftSet =>
    giftSet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SEO
        title="Admin Gift Sets - FOREVER Luxury Skincare"
        description="Manage gift sets catalog, add new gift sets, edit details for FOREVER Luxury Skincare."
        keywords="admin, gift sets, gift set management, luxury, catalog"
        noindex={true}
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2A26] mb-2 flex items-center gap-2">
              <Gift size={28} className="text-[#A88B5C]" />
              Gift Sets
            </h1>
            <p className="text-sm text-[#5C5852]">Manage your gift sets catalog</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A88B5C]" />
              <input
                type="text"
                placeholder="Search gift sets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setEditingGiftSet(null);
                setFormData({ name: "", description: "", price: "", originalPrice: "", featured: false, inStock: true, stockCount: "" });
                handleClearAllImages();
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#A88B5C] text-white rounded-lg hover:bg-[#8B6F47] transition-colors whitespace-nowrap"
            >
              <Plus size={20} />
              Add Gift Set
            </motion.button>
          </div>
        </div>

        {/* Gift Sets Grid */}
        {loading ? (
          <div className="text-center py-12 text-[#5C5852]">Loading gift sets...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGiftSets.map((giftSet) => (
              <motion.div
                key={giftSet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-[#A88B5C]/10 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-[#F5F5F5] overflow-hidden relative">
                  <ImageWithFallback
                    src={giftSet.image || (giftSet.images && giftSet.images.length > 0 ? giftSet.images[0] : '/images/default-product.jpg')}
                    alt={giftSet.name}
                    className="w-full h-full object-cover"
                    fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="text-[#A88B5C]/30" size={48} />
                      </div>
                    }
                  />
                  {giftSet.featured && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-[#A88B5C] text-white text-xs rounded">
                      Featured
                    </div>
                  )}
                  {!giftSet.inStock && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded">
                      Out of Stock
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs text-[#A88B5C] mb-1 flex items-center gap-1">
                    <Gift size={12} />
                    GIFT SET
                  </div>
                  <h3 className="font-medium text-[#2D2A26] mb-2">{giftSet.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-bold text-[#A88B5C]">${giftSet.price}</div>
                    {giftSet.originalPrice && giftSet.originalPrice > giftSet.price && (
                      <span className="text-xs text-[#5C5852] line-through">${giftSet.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingGiftSet(giftSet);
                        setFormData({
                          name: giftSet.name,
                          description: giftSet.description || "",
                          price: giftSet.price.toString(),
                          originalPrice: giftSet.originalPrice?.toString() || "",
                          featured: giftSet.featured || false,
                          inStock: giftSet.inStock !== false,
                          stockCount: giftSet.stockCount?.toString() || "",
                        });
                        setGiftSetImages(giftSet.images && giftSet.images.length > 0
                          ? giftSet.images.map((imgUrl) => ({
                              preview: imgUrl,
                              error: false,
                            }))
                          : [{ preview: giftSet.image || '/images/default-product.jpg', error: false }]);
                        setShowAddModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#EFEAE4] text-[#A88B5C] text-sm rounded-lg hover:bg-[#E0D5C7] transition-colors"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm(`Are you sure you want to delete "${giftSet.name}"?`)) {
                          try {
                            await giftSetsAPI.delete(giftSet.id);
                            setGiftSets(giftSets.filter(g => g.id !== giftSet.id));
                            alert("Gift Set deleted successfully!");
                          } catch (error) {
                            console.error("Failed to delete gift set:", error);
                            alert("Failed to delete gift set. Please try again.");
                          }
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add/Edit Gift Set Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#2D2A26]">
                  {editingGiftSet ? "Edit Gift Set" : "Add New Gift Set"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingGiftSet(null);
                    handleClearAllImages();
                    setFormData({ name: "", description: "", price: "", originalPrice: "", featured: false, inStock: true, stockCount: "" });
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

                  if (!isAuthenticated) {
                    alert("You must be logged in as an admin to perform this action.");
                    return;
                  }

                  if (!formData.name || !formData.price) {
                    alert("Please fill in all required fields (Name, Price).");
                    return;
                  }

                  const priceValue = parseFloat(formData.price);
                  if (isNaN(priceValue) || priceValue <= 0) {
                    alert("Please enter a valid price (greater than 0)");
                    return;
                  }

                  const imagesToUpload = await Promise.all(
                    giftSetImages.map(async (img) => {
                      if (img.file) {
                        return new Promise<string>((resolve) => {
                          const reader = new FileReader();
                          reader.onloadend = () => resolve(reader.result as string);
                          reader.onerror = () => resolve('/images/default-product.jpg');
                          reader.readAsDataURL(img.file!);
                        });
                      }
                      return img.preview;
                    })
                  );

                  const images = imagesToUpload.filter(src => src && typeof src === 'string' && src.trim() !== '');

                  if (images.length === 0) {
                    alert("Please add at least one image.");
                    return;
                  }

                  const payload = {
                    name: formData.name.trim(),
                    description: formData.description?.trim() || '',
                    price: priceValue,
                    originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
                    images: images,
                    featured: formData.featured || false,
                    inStock: formData.inStock !== false,
                    stockCount: formData.stockCount ? parseInt(formData.stockCount) : undefined,
                    products: [], // Can be extended to select products
                  };

                  try {
                    if (editingGiftSet) {
                      await giftSetsAPI.update(editingGiftSet.id, payload);
                      alert("Gift Set updated successfully!");
                    } else {
                      await giftSetsAPI.create(payload);
                      alert("Gift Set added successfully!");
                    }

                    const data = await giftSetsAPI.getAll();
                    setGiftSets(data);

                    setShowAddModal(false);
                    setEditingGiftSet(null);
                    handleClearAllImages();
                    setFormData({ name: "", description: "", price: "", originalPrice: "", featured: false, inStock: true, stockCount: "" });
                  } catch (error: any) {
                    console.error("Failed to save gift set:", error);
                    let errorMessage = error.message || 'Unknown error';
                    
                    // Provide helpful error messages
                    if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
                      errorMessage = 'API endpoint not found. The gift-sets API may not be deployed yet. Please check your deployment.';
                    } else if (errorMessage.includes('TABLE_NOT_FOUND') || errorMessage.includes('does not exist')) {
                      errorMessage = 'GiftSet table does not exist in the database. Please run: npx prisma db push --schema=server/prisma/schema.prisma';
                    } else if (errorMessage.includes('Database table not found')) {
                      errorMessage = 'GiftSet table does not exist. Please run the Prisma migration to create it.';
                    }
                    
                    alert(`Failed to save gift set: ${errorMessage}`);
                  }
                }}
              >
                {/* Image Upload Section - Similar to ProductsPage */}
                <div>
                  <label className="block text-sm text-[#2D2A26] mb-2">
                    Gift Set Images ({giftSetImages.length}/{maxImages})
                  </label>
                  {/* Image URL Input */}
                  <div className="mb-4">
                    <textarea
                      placeholder="https://example.com/image1.jpg&#10;/images/local-image.png"
                      rows={3}
                      className="w-full px-3 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C] text-sm"
                      onBlur={(e) => {
                        const urls = e.target.value
                          .split('\n')
                          .map(url => url.trim())
                          .filter(url => url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('data:')));

                        if (urls.length > 0) {
                          const remainingSlots = maxImages - giftSetImages.length;
                          const newImages = urls.slice(0, remainingSlots).map(url => ({ preview: url, error: false }));
                          setGiftSetImages(prev => [...prev, ...newImages]);
                          e.target.value = '';
                        }
                      }}
                    ></textarea>
                  </div>
                  {/* Image Grid */}
                  {giftSetImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {giftSetImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="w-full aspect-square rounded-lg overflow-hidden border border-[#A88B5C]/20 bg-[#F5F5F5]">
                            <img
                              src={image.preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={() => {
                                setGiftSetImages((prev) =>
                                  prev.map((img, i) => i === index ? { ...img, error: true } : img)
                                );
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Upload Area */}
                  {giftSetImages.length < maxImages && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-[#A88B5C]/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#A88B5C] hover:bg-[#FFF8E7]/50 transition-colors h-32"
                    >
                      <Upload className="text-[#A88B5C] mb-2" size={24} />
                      <p className="text-sm text-[#5C5852]">Click to upload images</p>
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
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#2D2A26] mb-2">Gift Set Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#2D2A26] mb-2">Price *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
                      required
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#2D2A26] mb-2">Original Price (Optional)</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full px-3 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#2D2A26] mb-2">Stock Count (Optional)</label>
                    <input
                      type="number"
                      value={formData.stockCount}
                      onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                      className="w-full px-3 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#2D2A26] mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
                  ></textarea>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="h-4 w-4 text-[#A88B5C] border-[#A88B5C]/20 rounded focus:ring-[#A88B5C]"
                    />
                    <span className="text-sm text-[#2D2A26]">Featured Gift Set</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="h-4 w-4 text-[#A88B5C] border-[#A88B5C]/20 rounded focus:ring-[#A88B5C]"
                    />
                    <span className="text-sm text-[#2D2A26]">In Stock</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingGiftSet(null);
                      handleClearAllImages();
                      setFormData({ name: "", description: "", price: "", originalPrice: "", featured: false, inStock: true, stockCount: "" });
                    }}
                    className="px-4 py-2 border border-[#A88B5C]/30 text-[#5C5852] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-[#A88B5C] text-white rounded-lg hover:bg-[#8B6F47] transition-colors"
                  >
                    {editingGiftSet ? "Save Changes" : "Add Gift Set"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
