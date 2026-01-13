import { motion } from "motion/react";
import { ShoppingBag, Menu, X, Shield, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";

export function Hero() {
  const navigate = useNavigate();
  const { setIsOpen, getTotalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#FFF8E7] to-[#F5E6D3]">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-4 py-4 sm:px-6 sm:py-6 md:px-12 md:py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            onClick={() => navigate("/")}
            className="text-lg sm:text-xl md:text-2xl tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C] hover:text-[#8F7A52] transition-colors touch-manipulation"
          >
            {settings.storeName}
          </motion.button>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex gap-4 sm:gap-6 md:gap-8 items-center"
          >
            <div className="hidden md:flex gap-8 text-sm tracking-wider text-[#A88B5C]">
              <button onClick={() => scrollToSection("story")} className="hover:text-[#8F7A52] transition-colors touch-manipulation">STORY</button>
              <Link to="/products" className="hover:text-[#8F7A52] transition-colors">PRODUCTS</Link>
              <button onClick={() => scrollToSection("ingredients")} className="hover:text-[#8F7A52] transition-colors touch-manipulation">INGREDIENTS</button>
              <button onClick={() => scrollToSection("benefits")} className="hover:text-[#8F7A52] transition-colors touch-manipulation">BENEFITS</button>
            </div>
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="p-2 text-[#5C5852] hover:text-[#A88B5C] transition-colors rounded-full hover:bg-[#FFF8E7]/50"
                    title={user?.name || user?.email || "Profile"}
                  >
                    <User size={20} />
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 text-[#5C5852] hover:text-[#A88B5C] transition-colors rounded-full hover:bg-[#FFF8E7]/50"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-2 text-xs tracking-wider text-[#A88B5C] hover:text-[#8F7A52] transition-colors">
                    LOGIN
                  </Link>
                  <Link to="/register" className="px-3 py-2 text-xs tracking-wider bg-[#A88B5C] text-white hover:bg-[#8F7A52] transition-colors rounded">
                    SIGN UP
                  </Link>
                </>
              )}
              {/* Admin button - only show to admin users */}
              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 px-3 py-2 text-xs tracking-wider text-[#A88B5C] hover:text-[#8F7A52] transition-colors touch-manipulation border border-[#A88B5C]/30 hover:border-[#A88B5C] rounded"
                  title="Admin Panel"
                >
                  <Shield size={14} />
                  <span>ADMIN</span>
                </Link>
              )}
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 hover:text-[#A88B5C] transition-colors touch-manipulation"
            >
              <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#A88B5C] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden hover:text-[#A88B5C] transition-colors touch-manipulation"
            >
              {mobileMenuOpen ? <X size={18} className="sm:w-5 sm:h-5" /> : <Menu size={18} className="sm:w-5 sm:h-5" />}
            </button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 bg-white/95 backdrop-blur-sm border border-[#A88B5C]/20 rounded-lg p-4 space-y-3"
          >
            <button onClick={() => scrollToSection("story")} className="block w-full text-left text-sm tracking-wider text-[#A88B5C] hover:text-[#8F7A52] transition-colors py-2">STORY</button>
            <Link to="/products" className="block w-full text-left text-sm tracking-wider text-[#A88B5C] hover:text-[#8F7A52] transition-colors py-2">PRODUCTS</Link>
            <button onClick={() => scrollToSection("ingredients")} className="block w-full text-left text-sm tracking-wider text-[#A88B5C] hover:text-[#8F7A52] transition-colors py-2">INGREDIENTS</button>
            <button onClick={() => scrollToSection("benefits")} className="block w-full text-left text-sm tracking-wider text-[#A88B5C] hover:text-[#8F7A52] transition-colors py-2">BENEFITS</button>
            <Link to="/contact" className="block w-full text-left text-sm tracking-wider text-[#A88B5C] hover:text-[#8F7A52] transition-colors py-2">CONTACT</Link>
            <div className="border-t border-[#A88B5C]/20 pt-2 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-xs text-[#5C5852] hover:text-[#A88B5C] transition-colors py-2"
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  {/* Admin link - only show to admin users */}
                  {user?.role === 'admin' && (
                    <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 w-full text-left text-sm tracking-wider text-[#A88B5C] hover:text-[#8F7A52] transition-colors py-2">
                      <Shield size={14} />
                      <span>ADMIN PANEL</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-left text-xs text-[#5C5852] hover:text-[#A88B5C] transition-colors py-2"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left text-sm tracking-wider text-[#A88B5C] hover:text-[#8F7A52] transition-colors py-2">
                    LOGIN
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left text-sm tracking-wider text-[#A88B5C] hover:text-[#8F7A52] transition-colors py-2">
                    SIGN UP
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-24 sm:pt-28 md:pt-40 pb-12 sm:pb-16 md:pb-20">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="mb-4 sm:mb-6 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C]">
              RADIANCE COLLECTION
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-6 sm:mb-8 text-[#2D2A26] leading-[1.1]">
              Elixir de
              <br />
              <span className="italic">Jeunesse</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 text-[#5C5852] leading-relaxed max-w-md">
              A transcendent fusion of rare botanicals and cutting-edge science, crafted to unveil your skin's innate luminosity.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/products")}
                className="px-8 sm:px-10 py-3 sm:py-4 bg-[#A88B5C] text-white tracking-wider text-xs sm:text-sm hover:bg-[#8F7A52] transition-colors touch-manipulation"
              >
                DISCOVER NOW
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection("story")}
                className="px-8 sm:px-10 py-3 sm:py-4 border border-[#A88B5C] text-[#A88B5C] tracking-wider text-xs sm:text-sm hover:bg-[#A88B5C] hover:text-white transition-colors touch-manipulation"
              >
                LEARN MORE
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-[#A88B5C]/30">
              <div>
                <div className="text-2xl sm:text-3xl mb-1 text-[#A88B5C]">98%</div>
                <div className="text-[10px] sm:text-xs tracking-wider text-[#5C5852]">NATURAL</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl mb-1 text-[#A88B5C]">24h</div>
                <div className="text-[10px] sm:text-xs tracking-wider text-[#5C5852]">HYDRATION</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl mb-1 text-[#A88B5C]">15+</div>
                <div className="text-[10px] sm:text-xs tracking-wider text-[#5C5852]">BOTANICALS</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            <div className="relative z-10">
              <ImageWithFallback
                src="/images/golden-serum.jpg"
                alt="Forever Elixir de Jeunesse"
                className="w-full h-auto rounded-sm shadow-2xl"
              />
            </div>
            {/* Decorative Elements */}
            <motion.div
              animate={{
                rotate: [0, 5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="hidden sm:block absolute -top-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#A88B5C] opacity-20 blur-3xl"
            />
            <motion.div
              animate={{
                rotate: [0, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="hidden sm:block absolute -bottom-12 -left-12 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#D4C9B3] opacity-30 blur-3xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-12 sm:h-16 bg-gradient-to-b from-transparent via-[#A88B5C] to-transparent"
        />
      </motion.div>
    </div>
  );
}
