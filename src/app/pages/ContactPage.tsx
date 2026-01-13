import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";

export function ContactPage() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <SEO
        title="Contact Us - FOREVER Luxury Skincare | Get in Touch"
        description="Contact FOREVER luxury skincare. Reach out for product inquiries, customer support, or franchise opportunities. We're here to help you discover premium beauty."
        keywords="contact forever, luxury skincare contact, customer support, beauty products inquiry"
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
            className="flex items-center gap-2 text-[#A88B5C] hover:text-[#8F7A52] transition-colors touch-manipulation"
          >
            <ArrowLeft size={20} />
            <span className="text-sm sm:text-base">Back to Home</span>
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate("/")}
            className="text-lg sm:text-xl md:text-2xl tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C] hover:text-[#8F7A52] transition-colors touch-manipulation"
          >
            {settings.storeName}
          </motion.button>
        </div>
      </nav>

      {/* Contact Content */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <div className="mb-4 sm:mb-6 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C]">
              GET IN TOUCH
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 text-[#2D2A26] leading-tight">
              Contact <span className="italic">Us</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#5C5852] max-w-2xl mx-auto px-4">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 sm:gap-12 md:gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="text-[#A88B5C]" size={20} />
                    <h3 className="text-lg sm:text-xl text-[#2D2A26]">Email</h3>
                  </div>
                  <a href={`mailto:${settings.email}`} className="text-sm sm:text-base text-[#5C5852] hover:text-[#A88B5C] transition-colors">
                    {settings.email}
                  </a>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Phone className="text-[#A88B5C]" size={20} />
                    <h3 className="text-lg sm:text-xl text-[#2D2A26]">Phone</h3>
                  </div>
                  <a href={`tel:${settings.phone}`} className="text-sm sm:text-base text-[#5C5852] hover:text-[#A88B5C] transition-colors">
                    {settings.phone}
                  </a>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="text-[#A88B5C]" size={20} />
                    <h3 className="text-lg sm:text-xl text-[#2D2A26]">Address</h3>
                  </div>
                  <p className="text-sm sm:text-base text-[#5C5852]">
                    123 Luxury Avenue<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm text-[#2D2A26] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-[#2D2A26] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm text-[#2D2A26] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors text-sm sm:text-base resize-none"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 sm:px-10 py-3 sm:py-4 bg-[#A88B5C] text-white tracking-wider text-xs sm:text-sm hover:bg-[#8F7A52] transition-colors touch-manipulation flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
}

