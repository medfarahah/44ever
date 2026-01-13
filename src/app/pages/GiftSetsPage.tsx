import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { ShoppingBag, Star, ArrowLeft, Gift, Percent } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { giftSetsAPI, GiftSet } from "../services/api";
import { Footer } from "../components/Footer";
import { useCart } from "../context/CartContext";
import { SEO } from "../components/SEO";

export function GiftSetsPage() {
  const navigate = useNavigate();
  const { addToCart, setIsOpen, getTotalItems } = useCart();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [giftSets, setGiftSets] = useState<GiftSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGiftSets = async () => {
      try {
        const data = await giftSetsAPI.getAll();
        console.log('Gift Sets fetched:', data.length, 'sets');
        setGiftSets(data);
      } catch (error) {
        console.error("Failed to fetch gift sets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGiftSets();
  }, []);

  const handleAddToCart = (giftSet: GiftSet) => {
    // Convert gift set to cart item format
    const cartItem = {
      id: giftSet.id,
      name: giftSet.name,
      price: giftSet.price,
      image: giftSet.image || (giftSet.images && giftSet.images.length > 0 ? giftSet.images[0] : '/images/default-product.jpg'),
      category: 'Gift Set',
      quantity: 1
    };
    addToCart(cartItem);
  };

  return (
    <>
      <SEO
        title="Gift Sets - FOREVER Luxury Skincare | Curated Beauty Collections"
        description="Discover our exclusive gift sets featuring curated collections of FOREVER luxury skincare products. Perfect gifts for yourself or loved ones. Shop premium beauty gift sets."
        keywords="gift sets, beauty gift sets, luxury skincare gifts, curated collections, beauty bundles, skincare sets"
      />
      <div className="bg-gradient-to-br from-white via-[#FFF8E7] to-[#F5E6D3] min-h-screen">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-white via-[#FFF8E7]/90 to-white backdrop-blur-sm border-b border-[#A88B5C]/20 px-4 sm:px-6 md:px-12 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => navigate("/")}
              className="text-lg sm:text-xl md:text-2xl tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C] hover:text-[#8F7A52] transition-colors"
            >
              FOREVER
            </motion.button>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2 text-[#5C5852] hover:text-[#A88B5C] transition-colors rounded-full hover:bg-[#FFF8E7]/50"
                title="View Cart"
              >
                <ShoppingBag size={20} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              <Link to="/" className="flex items-center gap-2 px-4 py-2 border-2 border-[#A88B5C] text-[#A88B5C] tracking-wider text-xs sm:text-sm hover:bg-[#A88B5C] hover:text-white transition-colors touch-manipulation">
                <ArrowLeft size={16} /> Back to Home
              </Link>
            </div>
          </div>
        </nav>

        <section className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16 md:mb-20"
            >
              <div className="mb-4 sm:mb-6 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C] flex items-center justify-center gap-2">
                <Gift size={16} />
                CURATED COLLECTIONS
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 text-[#2D2A26] leading-tight">
                Gift <span className="italic">Sets</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-[#5C5852] max-w-2xl mx-auto px-4">
                Thoughtfully curated collections of our finest products, perfect for gifting or treating yourself.
              </p>
            </motion.div>

            {/* Gift Sets Grid */}
            {loading ? (
              <div className="text-center py-12 text-[#5C5852]">Loading gift sets...</div>
            ) : giftSets.length === 0 ? (
              <div className="text-center py-12 text-[#5C5852]">
                <Gift size={48} className="mx-auto mb-4 text-[#A88B5C]/30" />
                <p>No gift sets available at the moment.</p>
                <p className="text-sm mt-2">Check back soon for new collections!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {giftSets.map((giftSet, index) => (
                  <motion.div
                    key={giftSet.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-gradient-to-br from-white to-[#FFF8E7]/90 backdrop-blur-sm border border-[#A88B5C]/20 hover:border-[#A88B5C]/50 transition-all duration-500 hover:shadow-xl overflow-hidden h-full flex flex-col">
                      {/* Gift Set Image */}
                      <div className="relative overflow-hidden">
                        <div className="aspect-square relative">
                          <ImageWithFallback
                            src={giftSet.image || (giftSet.images && giftSet.images.length > 0 ? giftSet.images[0] : '/images/default-product.jpg')}
                            alt={giftSet.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          {giftSet.featured && (
                            <div className="absolute top-4 left-4 bg-[#A88B5C] text-white px-3 py-1 text-[10px] sm:text-xs tracking-wider">
                              FEATURED
                            </div>
                          )}
                          {giftSet.originalPrice && giftSet.originalPrice > giftSet.price && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                              <Percent size={12} className="inline mr-1" />
                              {Math.round(((giftSet.originalPrice - giftSet.price) / giftSet.originalPrice) * 100)}% OFF
                            </div>
                          )}
                          {!giftSet.inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="bg-white px-4 py-2 text-sm font-medium">Out of Stock</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                      </div>

                      {/* Gift Set Info */}
                      <div className="p-4 sm:p-6 flex flex-col flex-grow">
                        <div className="mb-2 text-[10px] sm:text-xs tracking-[0.2em] text-[#A88B5C] flex items-center gap-1">
                          <Gift size={12} />
                          GIFT SET
                        </div>
                        <h3 className="text-lg sm:text-xl mb-2 sm:mb-3 text-[#2D2A26] font-medium">
                          {giftSet.name}
                        </h3>
                        
                        {giftSet.description && (
                          <p className="text-sm text-[#5C5852] mb-3 line-clamp-2">
                            {giftSet.description}
                          </p>
                        )}

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3 sm:mb-4">
                          {[...Array(giftSet.rating)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className="sm:w-3.5 sm:h-3.5 fill-[#A88B5C] text-[#A88B5C]"
                            />
                          ))}
                        </div>

                        {/* Price and Button */}
                        <div className="mt-auto">
                          <div className="flex items-center gap-2 mb-3">
                            {giftSet.originalPrice && giftSet.originalPrice > giftSet.price ? (
                              <>
                                <div className="text-xl sm:text-2xl text-[#A88B5C] font-medium">
                                  ${giftSet.price}
                                </div>
                                <div className="text-sm text-[#5C5852] line-through">
                                  ${giftSet.originalPrice}
                                </div>
                              </>
                            ) : (
                              <div className="text-xl sm:text-2xl text-[#A88B5C] font-medium">
                                ${giftSet.price}
                              </div>
                            )}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddToCart(giftSet)}
                            disabled={!giftSet.inStock}
                            className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#A88B5C] text-white text-xs sm:text-sm hover:bg-[#8F7A52] transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingBag size={14} className="sm:w-4 sm:h-4" />
                            {giftSet.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
