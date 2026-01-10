import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Hero } from "./components/Hero";
import { ProductStory } from "./components/ProductStory";
import { Ingredients } from "./components/Ingredients";
import { Benefits } from "./components/Benefits";
import { Products } from "./components/Products";
import { Testimonials } from "./components/Testimonials";
import { Footer } from "./components/Footer";
import { Cart } from "./components/Cart";
import { ProductsPage } from "./pages/ProductsPage";
import { ContactPage } from "./pages/ContactPage";
import { IngredientsPage } from "./pages/IngredientsPage";
import { StoryPage } from "./pages/StoryPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { FranchisePage } from "./pages/FranchisePage";
import { CartProvider } from "./context/CartContext";

function HomePage() {
  return (
    <div className="bg-gradient-to-br from-white via-[#FFF8E7] to-[#F5E6D3] min-h-screen">
      <Hero />
      <ProductStory />
      <Ingredients />
      <Benefits />
      <Products />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Cart />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/ingredients" element={<IngredientsPage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/franchise" element={<FranchisePage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}
