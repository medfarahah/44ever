import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { ordersAPI, productsAPI, customersAPI, franchiseAPI } from "../../services/api";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: any[];
  topProducts: { name: string; sales: number; revenue: number }[];
  avgOrderValue: number;
  pendingOrders: number;
  completedOrders: number;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [],
    topProducts: [],
    avgOrderValue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [orders, products, customers, franchiseApps] = await Promise.all([
          ordersAPI.getAll().catch(() => []),
          productsAPI.getAll().catch(() => []),
          customersAPI.getAll().catch(() => []),
          franchiseAPI.getAll().catch(() => [])
        ]);

        // Calculate statistics
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
        const totalOrders = orders.length;
        const totalCustomers = customers.length;
        const totalProducts = products.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const pendingOrders = orders.filter((o: any) => o.status === 'Pending').length;
        const completedOrders = orders.filter((o: any) => o.status === 'Completed').length;

        // Get recent orders (last 5)
        const recentOrders = orders.slice(0, 5).map((order: any) => ({
          id: order.orderNumber || `#ORD-${order.id}`,
          customer: order.user?.name || order.customer?.name || 'Guest',
          amount: `$${order.total?.toFixed(2) || '0.00'}`,
          status: order.status || 'Pending',
          date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
        }));

        // Calculate top products from order items
        const productSales: { [key: string]: { name: string; sales: number; revenue: number } } = {};
        
        orders.forEach((order: any) => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item: any) => {
              const productName = item.name || 'Unknown Product';
              if (!productSales[productName]) {
                productSales[productName] = {
                  name: productName,
                  sales: 0,
                  revenue: 0
                };
              }
              productSales[productName].sales += item.quantity || 1;
              productSales[productName].revenue += (item.price || 0) * (item.quantity || 1);
            });
          }
        });

        // Convert to array and sort by revenue
        const topProducts = Object.values(productSales)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 4)
          .map(p => ({
            name: p.name,
            sales: p.sales,
            revenue: `$${p.revenue.toFixed(2)}`
          }));

        setStats({
          totalRevenue,
          totalOrders,
          totalCustomers,
          totalProducts,
          recentOrders,
          topProducts,
          avgOrderValue,
          pendingOrders,
          completedOrders
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const dashboardStats = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: stats.totalOrders > 0 ? `${((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)}%` : "0%",
      trend: "up",
      icon: DollarSign,
      color: "bg-green-500"
    },
    {
      title: "Orders",
      value: formatNumber(stats.totalOrders),
      change: stats.pendingOrders > 0 ? `${stats.pendingOrders} pending` : "All processed",
      trend: stats.pendingOrders > 0 ? "up" : "down",
      icon: ShoppingBag,
      color: "bg-blue-500"
    },
    {
      title: "Customers",
      value: formatNumber(stats.totalCustomers),
      change: stats.totalCustomers > 0 ? "Active" : "No customers yet",
      trend: "up",
      icon: Users,
      color: "bg-purple-500"
    },
    {
      title: "Products",
      value: formatNumber(stats.totalProducts),
      change: stats.totalProducts > 0 ? "In catalog" : "No products",
      trend: "up",
      icon: Package,
      color: "bg-[#A88B5C]"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A88B5C] mx-auto mb-4"></div>
          <p className="text-[#5C5852]">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2A26] mb-2">Dashboard</h1>
        <p className="text-sm text-[#5C5852]">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg border border-[#A88B5C]/10 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.trend === "up" ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-[#2D2A26] mb-1">{stat.value}</div>
              <div className="text-sm text-[#5C5852]">{stat.title}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-lg border border-[#A88B5C]/10 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#2D2A26]">Recent Orders</h2>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="text-sm text-[#A88B5C] hover:text-[#8F7A52] transition-colors"
            >
              View All
            </button>
          </div>
          {stats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg hover:bg-[#FFF8E7] transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-[#2D2A26]">{order.id}</span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        order.status === "Completed" ? "bg-green-100 text-green-700" :
                        order.status === "Processing" ? "bg-blue-100 text-blue-700" :
                        order.status === "Shipped" ? "bg-purple-100 text-purple-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-[#5C5852]">{order.customer}</div>
                    <div className="text-xs text-[#5C5852]">{order.date}</div>
                  </div>
                  <div className="text-lg font-bold text-[#A88B5C]">{order.amount}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#5C5852]">
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
              <p>No orders yet</p>
            </div>
          )}
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white p-6 rounded-lg border border-[#A88B5C]/10 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#2D2A26]">Top Products</h2>
            <button 
              onClick={() => navigate('/admin/products')}
              className="text-sm text-[#A88B5C] hover:text-[#8F7A52] transition-colors"
            >
              View All
            </button>
          </div>
          {stats.topProducts.length > 0 ? (
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg hover:bg-[#FFF8E7] transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-[#A88B5C] rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[#2D2A26]">{product.name}</div>
                      <div className="text-sm text-[#5C5852]">{product.sales} sales</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-[#A88B5C]">{product.revenue}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#5C5852]">
              <Package size={48} className="mx-auto mb-4 opacity-50" />
              <p>No product sales yet</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gradient-to-br from-[#A88B5C] to-[#8F7A52] p-6 rounded-lg text-white"
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={24} />
          <h2 className="text-xl font-bold">Quick Insights</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold mb-1">
              {stats.totalOrders > 0 
                ? `${((stats.completedOrders / stats.totalOrders) * 100).toFixed(0)}%` 
                : '0%'}
            </div>
            <div className="text-sm text-white/80">Order Completion Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">
              {stats.pendingOrders}
            </div>
            <div className="text-sm text-white/80">Pending Orders</div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">
              {formatCurrency(stats.avgOrderValue)}
            </div>
            <div className="text-sm text-white/80">Avg. Order Value</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
