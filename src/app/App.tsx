import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Hero } from "./components/Hero";
import { ProductStory } from "./components/ProductStory";
import { Ingredients } from "./components/Ingredients";
import { Benefits } from "./components/Benefits";
import { Products } from "./components/Products";
import { Testimonials } from "./components/Testimonials";
import { Footer } from "./components/Footer";
import { ProductsPage } from "./pages/ProductsPage";

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
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </Router>
  );
}
