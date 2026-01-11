import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Edit,
  List,
  FileText,
  CreditCard,
  Truck,
  UserPlus,
  TrendingUp,
  Bell,
  Shield,
  Building2,
  CheckCircle
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/admin/dashboard",
    section: "main"
  },
  {
    icon: ShoppingBag,
    label: "Orders",
    path: "/admin/orders",
    section: "main",
    submenu: [
      { icon: List, label: "All Orders", path: "/admin/orders" },
      { icon: Plus, label: "New Order", path: "/admin/orders/new" },
      { icon: Truck, label: "Shipping", path: "/admin/orders/shipping" },
      { icon: CreditCard, label: "Payments", path: "/admin/orders/payments" },
    ]
  },
  {
    icon: Package,
    label: "Products",
    path: "/admin/products",
    section: "main",
    submenu: [
      { icon: List, label: "All Products", path: "/admin/products" },
      { icon: Plus, label: "Add Product", path: "/admin/products/add" },
      { icon: Edit, label: "Edit Products", path: "/admin/products/edit" },
      { icon: FileText, label: "Categories", path: "/admin/products/categories" },
    ]
  },
  {
    icon: Users,
    label: "Customers",
    path: "/admin/customers",
    section: "main",
    submenu: [
      { icon: List, label: "All Customers", path: "/admin/customers" },
      { icon: UserPlus, label: "Add Customer", path: "/admin/customers/add" },
      { icon: FileText, label: "Customer Groups", path: "/admin/customers/groups" },
    ]
  },
  {
    icon: BarChart3,
    label: "Analytics",
    path: "/admin/analytics",
    section: "main"
  },
  {
    icon: Building2,
    label: "Franchise",
    path: "/admin/franchise",
    section: "main",
    submenu: [
      { icon: List, label: "Applications", path: "/admin/franchise" },
      { icon: UserPlus, label: "New Inquiry", path: "/admin/franchise/new" },
      { icon: CheckCircle, label: "Approved Partners", path: "/admin/franchise/approved" },
    ]
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/admin/settings",
    section: "main",
    submenu: [
      { icon: Settings, label: "General", path: "/admin/settings" },
      { icon: Bell, label: "Notifications", path: "/admin/settings/notifications" },
      { icon: Shield, label: "Security", path: "/admin/settings/security" },
    ]
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, adminName } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const toggleSubmenu = (label: string) => {
    setExpandedMenus(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isMenuExpanded = (label: string) => expandedMenus.includes(label);
  const hasActiveSubmenu = (item: typeof menuItems[0]) => {
    return item.submenu?.some(sub => sub.path === location.pathname);
  };

  // Auto-expand menus with active submenu items
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.submenu && hasActiveSubmenu(item) && !expandedMenus.includes(item.label)) {
        setExpandedMenus(prev => [...prev, item.label]);
      }
    });
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#A88B5C] text-white rounded-lg"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#2D2A26] text-white transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#A88B5C]/20">
            <div className="text-2xl tracking-[0.2em] text-[#A88B5C] mb-1">FOREVER</div>
            <div className="text-xs text-white/60 tracking-wider">Admin Panel</div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-[#A88B5C]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#A88B5C] rounded-full flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <div className="text-sm font-medium">{adminName}</div>
                <div className="text-xs text-white/60">Administrator</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || hasActiveSubmenu(item);
              const isExpanded = isMenuExpanded(item.label);
              const hasSubmenu = item.submenu && item.submenu.length > 0;

              return (
                <div key={item.path}>
                  {hasSubmenu ? (
                    <>
                      <button
                        onClick={() => {
                          toggleSubmenu(item.label);
                          if (!isExpanded && !isActive) {
                            navigate(item.path);
                          }
                        }}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                            ? "bg-[#A88B5C] text-white"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={20} />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3 4.5L6 7.5L9 4.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.div>
                      </button>
                      {isExpanded && item.submenu && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-4"
                        >
                          {item.submenu.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const isSubActive = location.pathname === subItem.path;
                            return (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${isSubActive
                                    ? "bg-[#A88B5C]/50 text-white border-l-2 border-[#A88B5C]"
                                    : "text-white/60 hover:bg-white/5 hover:text-white/80"
                                  }`}
                              >
                                <SubIcon size={16} />
                                <span>{subItem.label}</span>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                          ? "bg-[#A88B5C] text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      <Icon size={20} />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-[#A88B5C]/20">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
              <LogOut size={20} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

