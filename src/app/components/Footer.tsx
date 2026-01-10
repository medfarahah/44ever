import { motion } from "motion/react";
import { Instagram, Facebook, Youtube, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert("Thank you for subscribing! We'll keep you updated with our latest news.");
      setEmail("");
    }
  };
  return (
    <footer className="bg-[#2D2A26] text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">
                Join Our <span className="italic">Circle</span>
              </h3>
              <p className="text-sm sm:text-base text-white/70">
                Receive exclusive insights, early access to new collections, and beauty rituals from our experts.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#A88B5C] transition-colors text-sm sm:text-base"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-[#A88B5C] text-white hover:bg-[#8F7A52] transition-colors touch-manipulation flex items-center justify-center"
              >
                <Mail size={18} className="sm:w-5 sm:h-5" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 mb-8 md:mb-0">
            <div className="text-xl sm:text-2xl tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 text-[#A88B5C]">FOREVER</div>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              Illuminating beauty through the harmony of nature and science.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs sm:text-sm tracking-wider mb-4 sm:mb-6">SHOP</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/60">
              <li><Link to="/products" className="hover:text-[#A88B5C] transition-colors touch-manipulation">Elixir Collection</Link></li>
              <li><Link to="/products" className="hover:text-[#A88B5C] transition-colors touch-manipulation">Serums</Link></li>
              <li><Link to="/products" className="hover:text-[#A88B5C] transition-colors touch-manipulation">Moisturizers</Link></li>
              <li><Link to="/products" className="hover:text-[#A88B5C] transition-colors touch-manipulation">Gift Sets</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs sm:text-sm tracking-wider mb-4 sm:mb-6">ABOUT</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/60">
              <li><Link to="/story" className="hover:text-[#A88B5C] transition-colors touch-manipulation">Our Story</Link></li>
              <li><Link to="/ingredients" className="hover:text-[#A88B5C] transition-colors touch-manipulation">Ingredients</Link></li>
              <li><Link to="/franchise" className="hover:text-[#A88B5C] transition-colors touch-manipulation">Franchise</Link></li>
              <li><a href="#benefits" className="hover:text-[#A88B5C] transition-colors touch-manipulation">Science</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs sm:text-sm tracking-wider mb-4 sm:mb-6">SUPPORT</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/60">
              <li><Link to="/contact" className="hover:text-[#A88B5C] transition-colors touch-manipulation">Contact Us</Link></li>
              <li><a href="#benefits" className="hover:text-[#A88B5C] transition-colors touch-manipulation">Shipping</a></li>
              <li><a href="#benefits" className="hover:text-[#A88B5C] transition-colors touch-manipulation">Returns</a></li>
              <li><a href="#benefits" className="hover:text-[#A88B5C] transition-colors touch-manipulation">FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="text-xs sm:text-sm text-white/40 text-center md:text-left">
            © 2026 Forever. All rights reserved.
          </div>

          {/* Social Links */}
          <div className="flex gap-4 sm:gap-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#A88B5C] transition-colors touch-manipulation">
              <Instagram size={18} className="sm:w-5 sm:h-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#A88B5C] transition-colors touch-manipulation">
              <Facebook size={18} className="sm:w-5 sm:h-5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#A88B5C] transition-colors touch-manipulation">
              <Youtube size={18} className="sm:w-5 sm:h-5" />
            </a>
          </div>

          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-white/40">
            <a href="#" className="hover:text-[#A88B5C] transition-colors touch-manipulation">Privacy</a>
            <a href="#" className="hover:text-[#A88B5C] transition-colors touch-manipulation">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
