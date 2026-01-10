import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Cart() {
  const navigate = useNavigate();
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#A88B5C]/20">
              <h2 className="text-xl tracking-wider text-[#2D2A26]">SHOPPING CART</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:text-[#A88B5C] transition-colors touch-manipulation"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-[#A88B5C]/30 mb-4" />
                  <p className="text-[#5C5852] mb-2">Your cart is empty</p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      window.location.href = "/products";
                    }}
                    className="text-[#A88B5C] hover:text-[#8F7A52] transition-colors text-sm"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 p-4 border border-[#A88B5C]/20 hover:border-[#A88B5C]/50 transition-colors"
                    >
                      <div className="w-20 h-20 flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-[#2D2A26] mb-1 truncate">{item.name}</h3>
                        <p className="text-xs text-[#5C5852] mb-2">{item.category}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-[#A88B5C] font-medium">${item.price}</div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-[#A88B5C]/10 transition-colors touch-manipulation"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm text-[#2D2A26] w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-[#A88B5C]/10 transition-colors touch-manipulation"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-[#5C5852] hover:text-[#A88B5C] transition-colors mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-[#A88B5C]/20 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#5C5852]">Total ({getTotalItems()} items)</span>
                  <span className="text-xl font-medium text-[#A88B5C]">${getTotalPrice().toFixed(2)}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/checkout");
                  }}
                  className="w-full px-6 py-3 bg-[#A88B5C] text-white tracking-wider text-sm hover:bg-[#8F7A52] transition-colors touch-manipulation"
                >
                  CHECKOUT
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

