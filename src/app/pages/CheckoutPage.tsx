import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, MapPin, Lock } from "lucide-react";
import { Footer } from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ordersAPI, customersAPI } from "../services/api";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping");
  const [formData, setFormData] = useState({
    // Shipping
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    // Billing
    sameAsShipping: true,
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    billingCountry: "United States",
    // Payment
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const shipping = 0; // Free shipping
  const tax = getTotalPrice() * 0.08; // 8% tax
  const total = getTotalPrice() + shipping + tax;

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      const nameParts = (user.name || "").split(" ");
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateShipping = () => {
    const required = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"];
    return required.every((field) => formData[field as keyof typeof formData]);
  };

  const validatePayment = () => {
    return formData.cardNumber && formData.cardName && formData.expiryDate && formData.cvv;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      if (formData.sameAsShipping) {
        setFormData((prev) => ({
          ...prev,
          billingFirstName: prev.firstName,
          billingLastName: prev.lastName,
          billingAddress: prev.address,
          billingCity: prev.city,
          billingState: prev.state,
          billingZipCode: prev.zipCode,
          billingCountry: prev.country,
        }));
      }
      setStep("payment");
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePayment()) {
      setStep("review");
    }
  };

  const handlePlaceOrder = async () => {
    try {
      // Create or get customer
      const customerData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        }
      };

      let customer;
      try {
        customer = await customersAPI.create(customerData);
      } catch (error) {
        console.error("Customer creation error:", error);
        // Continue anyway, customer might already exist
      }

      // Create order
      const orderData = {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        customer: customerData,
        shipping: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
        },
        payment: {
          method: "card",
          cardLast4: formData.cardNumber.slice(-4),
          billingAddress: formData.sameAsShipping ? {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          } : {
            street: formData.billingAddress,
            city: formData.billingCity,
            state: formData.billingState,
            zipCode: formData.billingZipCode,
            country: formData.billingCountry,
          }
        }
      };

      await ordersAPI.create(orderData);
      
      alert("Order placed successfully! Thank you for your purchase.");
      clearCart();
      navigate("/");
    } catch (error) {
      console.error("Order creation error:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white via-[#FFF8E7] to-[#F5E6D3] min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl mb-4 text-[#2D2A26]">Your cart is empty</h2>
          <button
            onClick={() => navigate("/products")}
            className="px-8 py-3 bg-[#A88B5C] text-white hover:bg-[#8F7A52] transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-[#FFF8E7] to-[#F5E6D3] min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-gradient-to-r from-white via-[#FFF8E7]/90 to-white backdrop-blur-sm border-b border-[#A88B5C]/20 px-4 sm:px-6 md:px-12 py-4 sm:py-6">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20">
        {/* Progress Steps */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <div className={`flex items-center gap-2 ${step === "shipping" ? "text-[#A88B5C]" : step === "payment" || step === "review" ? "text-[#A88B5C]" : "text-[#5C5852]"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "shipping" ? "bg-[#A88B5C] text-white" : step === "payment" || step === "review" ? "bg-[#A88B5C] text-white" : "bg-[#A88B5C]/20 text-[#5C5852]"}`}>
                1
              </div>
              <span className="hidden sm:inline text-xs sm:text-sm tracking-wider">SHIPPING</span>
            </div>
            <div className={`h-px w-12 sm:w-24 ${step === "payment" || step === "review" ? "bg-[#A88B5C]" : "bg-[#A88B5C]/20"}`} />
            <div className={`flex items-center gap-2 ${step === "payment" ? "text-[#A88B5C]" : step === "review" ? "text-[#A88B5C]" : "text-[#5C5852]"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "payment" ? "bg-[#A88B5C] text-white" : step === "review" ? "bg-[#A88B5C] text-white" : "bg-[#A88B5C]/20 text-[#5C5852]"}`}>
                2
              </div>
              <span className="hidden sm:inline text-xs sm:text-sm tracking-wider">PAYMENT</span>
            </div>
            <div className={`h-px w-12 sm:w-24 ${step === "review" ? "bg-[#A88B5C]" : "bg-[#A88B5C]/20"}`} />
            <div className={`flex items-center gap-2 ${step === "review" ? "text-[#A88B5C]" : "text-[#5C5852]"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "review" ? "bg-[#A88B5C] text-white" : "bg-[#A88B5C]/20 text-[#5C5852]"}`}>
                3
              </div>
              <span className="hidden sm:inline text-xs sm:text-sm tracking-wider">REVIEW</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === "shipping" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 border border-[#A88B5C]/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="text-[#A88B5C]" size={24} />
                  <h2 className="text-xl sm:text-2xl text-[#2D2A26]">Shipping Information</h2>
                </div>
                <form onSubmit={handleShippingSubmit} className="space-y-4 sm:space-y-6">
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
                    <label className="block text-sm text-[#2D2A26] mb-2">Address *</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors"
                    />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-[#2D2A26] mb-2">City *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#2D2A26] mb-2">State *</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#2D2A26] mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        required
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#2D2A26] mb-2">Country *</label>
                    <select
                      required
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>France</option>
                      <option>Germany</option>
                    </select>
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-8 py-3 bg-[#A88B5C] text-white tracking-wider text-sm hover:bg-[#8F7A52] transition-colors touch-manipulation"
                  >
                    Continue to Payment
                  </motion.button>
                </form>
              </motion.div>
            )}

            {step === "payment" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 border border-[#A88B5C]/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="text-[#A88B5C]" size={24} />
                  <h2 className="text-xl sm:text-2xl text-[#2D2A26]">Payment Information</h2>
                </div>
                <form onSubmit={handlePaymentSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm text-[#2D2A26] mb-2">Card Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
                        handleInputChange("cardNumber", value);
                      }}
                      className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#2D2A26] mb-2">Cardholder Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.cardName}
                      onChange={(e) => handleInputChange("cardName", e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#2D2A26] mb-2">Expiry Date *</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        value={formData.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + "/" + value.slice(2, 4);
                          }
                          handleInputChange("expiryDate", value);
                        }}
                        className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#2D2A26] mb-2">CVV *</label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        maxLength={4}
                        value={formData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                        className="w-full px-4 py-3 bg-white/50 border border-[#A88B5C]/20 focus:outline-none focus:border-[#A88B5C] transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#5C5852]">
                    <Lock size={16} />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                  <div className="flex gap-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep("shipping")}
                      className="flex-1 px-8 py-3 border border-[#A88B5C] text-[#A88B5C] tracking-wider text-sm hover:bg-[#A88B5C] hover:text-white transition-colors touch-manipulation"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-8 py-3 bg-[#A88B5C] text-white tracking-wider text-sm hover:bg-[#8F7A52] transition-colors touch-manipulation"
                    >
                      Review Order
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === "review" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 border border-[#A88B5C]/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="text-[#A88B5C]" size={24} />
                  <h2 className="text-xl sm:text-2xl text-[#2D2A26]">Review Your Order</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-[#2D2A26] mb-2">Shipping Address</h3>
                    <p className="text-sm text-[#5C5852]">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.state} {formData.zipCode}<br />
                      {formData.country}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#2D2A26] mb-2">Payment Method</h3>
                    <p className="text-sm text-[#5C5852]">
                      {formData.cardName}<br />
                      **** **** **** {formData.cardNumber.slice(-4)}
                    </p>
                  </div>
                  <div className="flex gap-4 pt-4 border-t border-[#A88B5C]/20">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep("payment")}
                      className="flex-1 px-8 py-3 border border-[#A88B5C] text-[#A88B5C] tracking-wider text-sm hover:bg-[#A88B5C] hover:text-white transition-colors touch-manipulation"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePlaceOrder}
                      className="flex-1 px-8 py-3 bg-[#A88B5C] text-white tracking-wider text-sm hover:bg-[#8F7A52] transition-colors touch-manipulation"
                    >
                      Place Order
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 border border-[#A88B5C]/20 sticky top-24">
              <h2 className="text-xl sm:text-2xl text-[#2D2A26] mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-[#2D2A26] truncate">{item.name}</h3>
                      <p className="text-xs text-[#5C5852]">Qty: {item.quantity}</p>
                      <p className="text-sm text-[#A88B5C] font-medium">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-6 border-t border-[#A88B5C]/20">
                <div className="flex justify-between text-sm text-[#5C5852]">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#5C5852]">
                  <span>Shipping</span>
                  <span className="text-[#A88B5C]">FREE</span>
                </div>
                <div className="flex justify-between text-sm text-[#5C5852]">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-medium text-[#2D2A26] pt-3 border-t border-[#A88B5C]/20">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

