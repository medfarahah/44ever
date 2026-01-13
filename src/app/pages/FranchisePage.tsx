import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Users, TrendingUp, Award, Mail, Phone, MapPin } from "lucide-react";
import { Footer } from "../components/Footer";
import { StartBusiness } from "../components/StartBusiness";
import { franchiseAPI } from "../services/api";
import { SEO } from "../components/SEO";

const benefits = [
  {
    icon: Building2,
    title: "Established Brand",
    description: "Join a recognized luxury brand with proven market success"
  },
  {
    icon: Users,
    title: "Comprehensive Support",
    description: "Receive training, marketing materials, and ongoing business support"
  },
  {
    icon: TrendingUp,
    title: "Growth Potential",
    description: "Tap into the expanding luxury skincare market with high growth potential"
  },
  {
    icon: Award,
    title: "Premium Products",
    description: "Offer exclusive, high-quality products backed by scientific research"
  }
];

export function FranchisePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    investmentRange: "",
    experience: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await franchiseAPI.create(formData);
      alert("Thank you for your interest in becoming a Forever franchise partner! We'll review your application and get back to you within 5-7 business days.");
      setFormData({
        firstName: "",
        lastName: "",
      email: "",
      phone: "",
      company: "",
      location: "",
      investmentRange: "",
      experience: "",
      message: ""
    });
    } catch (error) {
      console.error("Failed to submit application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <SEO
        title="Franchise Opportunity - Join FOREVER Luxury Skincare | Start Your Business"
        description="Join FOREVER as a franchise partner. Start your luxury skincare business with an established brand. Discover franchise opportunities and investment details."
        keywords="forever franchise, luxury skincare franchise, beauty business opportunity, franchise investment"
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
            FOREVER
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <div className="mb-4 sm:mb-6 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C]">
              PARTNERSHIP OPPORTUNITY
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 text-[#2D2A26] leading-tight">
              Become a <span className="italic">Franchise Partner</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#5C5852] max-w-3xl mx-auto px-4">
              Join the Forever family and bring luxury skincare to your community. 
              We're looking for passionate partners who share our commitment to excellence and natural beauty.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16">
            {/* Benefits Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl sm:text-3xl mb-8 text-[#2D2A26]">Why Partner With Us</h2>
              <div className="space-y-6 sm:space-y-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex gap-4 sm:gap-6"
                    >
                      <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-[#A88B5C]/10 flex items-center justify-center">
                        <Icon className="text-[#A88B5C]" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl mb-2 text-[#2D2A26]">{benefit.title}</h3>
                        <p className="text-sm sm:text-base text-[#5C5852] leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Contact Info */}
              <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-[#A88B5C]/20">
                <h3 className="text-xl sm:text-2xl mb-6 text-[#2D2A26]">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="text-[#A88B5C]" size={20} />
                    <a href="mailto:franchise@forever.com" className="text-sm sm:text-base text-[#5C5852] hover:text-[#A88B5C] transition-colors">
                      franchise@forever.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-[#A88B5C]" size={20} />
                    <a href="tel:+15551234567" className="text-sm sm:text-base text-[#5C5852] hover:text-[#A88B5C] transition-colors">
                      +1 (555) 123-4567
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-[#A88B5C]" size={20} />
                    <span className="text-sm sm:text-base text-[#5C5852]">
                      123 Luxury Avenue, New York, NY 10001
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Application Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 border border-[#A88B5C]/20">
                <h2 className="text-2xl sm:text-3xl mb-6 text-[#2D2A26]">Franchise Application</h2>
                <p className="text-sm text-[#5C5852] mb-8">
                  Fill out the form below and our franchise team will contact you to discuss partnership opportunities.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#2D2A26] mb-2">First Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#2D2A26] mb-2">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-[#2D2A26] mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#2D2A26] mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#2D2A26] mb-2">Company Name</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#2D2A26] mb-2">Preferred Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="City, State/Country"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#2D2A26] mb-2">Investment Range *</label>
                    <select
                      required
                      value={formData.investmentRange}
                      onChange={(e) => handleInputChange("investmentRange", e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors"
                    >
                      <option value="">Select range</option>
                      <option value="100k-250k">$100,000 - $250,000</option>
                      <option value="250k-500k">$250,000 - $500,000</option>
                      <option value="500k-1m">$500,000 - $1,000,000</option>
                      <option value="1m+">$1,000,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-[#2D2A26] mb-2">Business Experience *</label>
                    <select
                      required
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors"
                    >
                      <option value="">Select experience level</option>
                      <option value="none">No previous business experience</option>
                      <option value="some">Some business experience</option>
                      <option value="experienced">Experienced business owner</option>
                      <option value="franchise">Previous franchise experience</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-[#2D2A26] mb-2">Tell us about yourself *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Why are you interested in becoming a Forever franchise partner?"
                      className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-8 py-3 bg-[#A88B5C] text-white tracking-wider text-sm hover:bg-[#8F7A52] transition-colors touch-manipulation"
                  >
                    Submit Application
                  </motion.button>

                  <p className="text-xs text-[#5C5852] text-center">
                    By submitting this form, you agree to be contacted by our franchise team. 
                    All information will be kept confidential.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4 text-[#2D2A26]">
              What We Offer
            </h2>
            <p className="text-sm sm:text-base text-[#5C5852] max-w-2xl mx-auto">
              As a Forever franchise partner, you'll receive comprehensive support to help you succeed
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Training & Support",
                items: [
                  "Initial training program",
                  "Ongoing business support",
                  "Marketing assistance",
                  "Product knowledge training"
                ]
              },
              {
                title: "Marketing Materials",
                items: [
                  "Brand guidelines",
                  "Marketing templates",
                  "Social media content",
                  "Advertising support"
                ]
              },
              {
                title: "Business Tools",
                items: [
                  "Point of sale system",
                  "Inventory management",
                  "Customer relationship tools",
                  "Financial reporting"
                ]
              }
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-[#FFF8E7]/50 p-6 sm:p-8 border border-[#A88B5C]/20"
              >
                <h3 className="text-xl mb-4 text-[#2D2A26]">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="text-sm text-[#5C5852] flex items-start gap-2">
                      <span className="text-[#A88B5C] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Start Your Business Section */}
      <StartBusiness />

      <Footer />
    </div>
    </>
  );
}

