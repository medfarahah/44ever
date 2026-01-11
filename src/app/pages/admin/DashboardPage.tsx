import { motion } from "motion/react";
import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$124,580",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "bg-green-500"
  },
  {
    title: "Orders",
    value: "1,247",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingBag,
    color: "bg-blue-500"
  },
  {
    title: "Customers",
    value: "892",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    color: "bg-purple-500"
  },
  {
    title: "Products",
    value: "47",
    change: "+3",
    trend: "up",
    icon: Package,
    color: "bg-[#A88B5C]"
  }
];

const recentOrders = [
  { id: "#ORD-001", customer: "Sophia Laurent", amount: "$385", status: "Completed", date: "2026-01-15" },
  { id: "#ORD-002", customer: "Isabella Chen", amount: "$570", status: "Processing", date: "2026-01-15" },
  { id: "#ORD-003", customer: "Amélie Dubois", amount: "$245", status: "Pending", date: "2026-01-14" },
  { id: "#ORD-004", customer: "Emma Wilson", amount: "$760", status: "Completed", date: "2026-01-14" },
  { id: "#ORD-005", customer: "Olivia Brown", amount: "$195", status: "Shipped", date: "2026-01-13" },
];

const topProducts = [
  { name: "Elixir de Jeunesse", sales: 124, revenue: "$47,740" },
  { name: "Luminous Night Cream", sales: 89, revenue: "$25,365" },
  { name: "Golden Radiance Serum", sales: 67, revenue: "$21,440" },
  { name: "Botanical Eye Elixir", sales: 45, revenue: "$11,025" },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2A26] mb-2">Dashboard</h1>
        <p className="text-sm text-[#5C5852]">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
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
            <button className="text-sm text-[#A88B5C] hover:text-[#8F7A52] transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
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
            <button className="text-sm text-[#A88B5C] hover:text-[#8F7A52] transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
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
            <div className="text-2xl font-bold mb-1">98%</div>
            <div className="text-sm text-white/80">Customer Satisfaction</div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">2.4 days</div>
            <div className="text-sm text-white/80">Avg. Delivery Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">$1,247</div>
            <div className="text-sm text-white/80">Avg. Order Value</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


