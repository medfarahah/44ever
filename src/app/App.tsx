import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Hero } from "./components/Hero";
import { ProductStory } from "./components/ProductStory";
import { Ingredients } from "./components/Ingredients";
import { Benefits } from "./components/Benefits";
import { Products } from "./components/Products";
import { Testimonials } from "./components/Testimonials";
import { StartBusiness } from "./components/StartBusiness";
import { Footer } from "./components/Footer";
import { Cart } from "./components/Cart";
import { ProductsPage } from "./pages/ProductsPage";
import { ContactPage } from "./pages/ContactPage";
import { IngredientsPage } from "./pages/IngredientsPage";
import { StoryPage } from "./pages/StoryPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { FranchisePage } from "./pages/FranchisePage";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { OrdersPage } from "./pages/admin/OrdersPage";
import { ProductsPage as AdminProductsPage } from "./pages/admin/ProductsPage";
import { CustomersPage } from "./pages/admin/CustomersPage";
import { AnalyticsPage } from "./pages/admin/AnalyticsPage";
import { SettingsPage } from "./pages/admin/SettingsPage";
import { FranchiseApplicationsPage } from "./pages/admin/FranchiseApplicationsPage";
import { AdminLayout } from "./components/admin/AdminLayout";
import { CartProvider } from "./context/CartContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { ErrorBoundary } from "./ErrorBoundary";

function HomePage() {
  return (
    <div className="bg-gradient-to-br from-white via-[#FFF8E7] to-[#F5E6D3] min-h-screen">
      <Hero />
      <ProductStory />
      <Ingredients />
      <Benefits />
      <Products />
      <Testimonials />
      <StartBusiness />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <AdminAuthProvider>
          <Router>
            <Cart />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/ingredients" element={<IngredientsPage />} />
              <Route path="/story" element={<StoryPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/franchise" element={<FranchisePage />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminLayout><DashboardPage /></AdminLayout>} />
              <Route path="/admin/orders" element={<AdminLayout><OrdersPage /></AdminLayout>} />
              <Route path="/admin/orders/new" element={<AdminLayout><OrdersPage /></AdminLayout>} />
              <Route path="/admin/orders/shipping" element={<AdminLayout><OrdersPage /></AdminLayout>} />
              <Route path="/admin/orders/payments" element={<AdminLayout><OrdersPage /></AdminLayout>} />
              <Route path="/admin/products" element={<AdminLayout><AdminProductsPage /></AdminLayout>} />
              <Route path="/admin/products/add" element={<AdminLayout><AdminProductsPage /></AdminLayout>} />
              <Route path="/admin/products/edit" element={<AdminLayout><AdminProductsPage /></AdminLayout>} />
              <Route path="/admin/products/categories" element={<AdminLayout><AdminProductsPage /></AdminLayout>} />
              <Route path="/admin/customers" element={<AdminLayout><CustomersPage /></AdminLayout>} />
              <Route path="/admin/customers/add" element={<AdminLayout><CustomersPage /></AdminLayout>} />
              <Route path="/admin/customers/groups" element={<AdminLayout><CustomersPage /></AdminLayout>} />
              <Route path="/admin/analytics" element={<AdminLayout><AnalyticsPage /></AdminLayout>} />
              <Route path="/admin/franchise" element={<AdminLayout><FranchiseApplicationsPage /></AdminLayout>} />
              <Route path="/admin/franchise/new" element={<AdminLayout><FranchiseApplicationsPage /></AdminLayout>} />
              <Route path="/admin/franchise/approved" element={<AdminLayout><FranchiseApplicationsPage /></AdminLayout>} />
              <Route path="/admin/settings" element={<AdminLayout><SettingsPage /></AdminLayout>} />
              <Route path="/admin/settings/notifications" element={<AdminLayout><SettingsPage /></AdminLayout>} />
              <Route path="/admin/settings/security" element={<AdminLayout><SettingsPage /></AdminLayout>} />
            </Routes>
          </Router>
        </AdminAuthProvider>
      </CartProvider>
    </ErrorBoundary>
  );
}
