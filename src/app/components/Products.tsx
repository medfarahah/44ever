import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

export function Products() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="products" className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-white via-[#FFF8E7] to-[#F5E6D3]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <div className="mb-4 sm:mb-6 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C]">
            OUR COLLECTION
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 text-[#2D2A26] leading-tight">
            Discover <span className="italic">Luxury</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#5C5852] max-w-2xl mx-auto px-4">
            Curated formulations that celebrate the finest ingredients nature has to offer.
          </p>
        </motion.div>

        {/* Products Grid - Horizontal scroll on mobile, grid on larger screens */}
        <div className="overflow-x-auto sm:overflow-x-visible -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 min-w-max sm:min-w-0">
            {products.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group flex-shrink-0 w-[280px] sm:w-auto"
              >
                <div className="bg-gradient-to-br from-white to-[#FFF8E7]/90 backdrop-blur-sm border border-[#A88B5C]/20 hover:border-[#A88B5C]/50 transition-all duration-500 hover:shadow-xl overflow-hidden h-full">
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <div className="aspect-square relative">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {product.featured && (
                      <div className="absolute top-4 left-4 bg-[#A88B5C] text-white px-3 py-1 text-[10px] sm:text-xs tracking-wider">
                        FEATURED
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 sm:p-6">
                  <div className="mb-2 text-[10px] sm:text-xs tracking-[0.2em] text-[#A88B5C]">
                    {product.category}
                  </div>
                  <h3 className="text-lg sm:text-xl mb-2 sm:mb-3 text-[#2D2A26] font-medium">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3 sm:mb-4">
                    {[...Array(product.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className="sm:w-3.5 sm:h-3.5 fill-[#A88B5C] text-[#A88B5C]"
                      />
                    ))}
                  </div>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-xl sm:text-2xl text-[#A88B5C] font-medium">
                      ${product.price}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#A88B5C] text-white text-xs sm:text-sm hover:bg-[#8F7A52] transition-colors touch-manipulation"
                    >
                      <ShoppingBag size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Add</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 sm:mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/products")}
            className="px-8 sm:px-12 py-3 sm:py-4 border-2 border-[#A88B5C] text-[#A88B5C] tracking-wider text-xs sm:text-sm hover:bg-[#A88B5C] hover:text-white transition-colors touch-manipulation"
          >
            VIEW ALL PRODUCTS
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

