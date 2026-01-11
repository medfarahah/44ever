import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Search, Filter, Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { ordersAPI } from "../../services/api";

export function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersAPI.getAll();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const customerName = order.customer?.name || order.customer || "";
    const orderId = order.orderNumber || order.id || "";
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || order.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700";
      case "Processing": return "bg-blue-100 text-blue-700";
      case "Shipped": return "bg-purple-100 text-purple-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2A26] mb-2">Orders</h1>
          <p className="text-sm text-[#5C5852]">Manage and track all customer orders</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[#A88B5C] text-white rounded-lg hover:bg-[#8F7A52] transition-colors text-sm">
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-[#A88B5C]/10 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5852]" size={20} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5852]" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C] appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-12 text-[#5C5852]">Loading orders...</div>
      ) : (
        <div className="bg-white rounded-lg border border-[#A88B5C]/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F5F5]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                const customerName = order.customer?.name || order.customer || "Unknown";
                const orderId = order.orderNumber || order.id || "";
                const itemsCount = order.items?.length || 0;
                const amount = order.total ? `$${order.total}` : "$0";
                const status = order.status || "Pending";
                const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "";
                
                return (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-[#FFF8E7] transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-[#2D2A26]">{orderId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-[#2D2A26]">{customerName}</div>
                    <div className="text-sm text-[#5C5852]">{order.customer?.email || ""}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#2D2A26]">{itemsCount} items</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#A88B5C]">{amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5C5852]">
                    {date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-[#A88B5C] hover:text-[#8F7A52] transition-colors">
                      <Eye size={18} />
                    </button>
                  </td>
                </motion.tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: orders.length, icon: Package, color: "bg-blue-500" },
          { label: "Pending", value: orders.filter(o => o.status === "Pending").length, icon: XCircle, color: "bg-yellow-500" },
          { label: "Processing", value: orders.filter(o => o.status === "Processing").length, icon: Truck, color: "bg-purple-500" },
          { label: "Completed", value: orders.filter(o => o.status === "Completed").length, icon: CheckCircle, color: "bg-green-500" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-4 rounded-lg border border-[#A88B5C]/10 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[#5C5852] mb-1">{stat.label}</div>
                  <div className="text-2xl font-bold text-[#2D2A26]">{stat.value}</div>
                </div>
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white" size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


