import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Search, Filter, Eye, Package, Truck, CheckCircle, XCircle, X, Edit2, Save, MapPin, CreditCard, User, Calendar } from "lucide-react";
import { ordersAPI } from "../../services/api";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [updating, setUpdating] = useState(false);

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewOrder = async (orderId: number) => {
    try {
      const order = await ordersAPI.getById(orderId);
      setSelectedOrder(order);
      setOrderNotes(order.notes || "");
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      alert("Failed to load order details");
    }
  };

  const handleStatusChange = async (orderId: number, currentStatus: string) => {
    setEditingStatus(orderId.toString());
    setNewStatus(currentStatus);
  };

  const handleSaveStatus = async (orderId: number) => {
    if (!newStatus) return;
    
    try {
      setUpdating(true);
      await ordersAPI.updateStatus(orderId, newStatus, orderNotes || undefined);
      
      // Refresh orders list
      await fetchOrders();
      
      // Update selected order if modal is open
      if (selectedOrder && selectedOrder.id === orderId) {
        const updatedOrder = await ordersAPI.getById(orderId);
        setSelectedOrder(updatedOrder);
        setOrderNotes(updatedOrder.notes || "");
      }
      
      setEditingStatus(null);
      alert("Order status updated successfully!");
    } catch (error: any) {
      console.error("Failed to update order status:", error);
      alert(`Failed to update order status: ${error.message || 'Please try again'}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async (orderId: number) => {
    try {
      setUpdating(true);
      const currentStatus = selectedOrder?.status || "Pending";
      await ordersAPI.updateStatus(orderId, currentStatus, orderNotes);
      
      // Refresh orders list
      await fetchOrders();
      
      // Update selected order
      const updatedOrder = await ordersAPI.getById(orderId);
      setSelectedOrder(updatedOrder);
      
      alert("Order notes updated successfully!");
    } catch (error: any) {
      console.error("Failed to update order notes:", error);
      alert(`Failed to update order notes: ${error.message || 'Please try again'}`);
    } finally {
      setUpdating(false);
    }
  };

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
                    {editingStatus === order.id.toString() ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="px-2 py-1 text-xs border border-[#A88B5C]/20 rounded focus:outline-none focus:border-[#A88B5C]"
                          disabled={updating}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleSaveStatus(order.id)}
                          disabled={updating}
                          className="text-green-600 hover:text-green-700 transition-colors"
                          title="Save"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingStatus(null);
                            setNewStatus("");
                          }}
                          disabled={updating}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(status)}`}>
                          {status}
                        </span>
                        <button
                          onClick={() => handleStatusChange(order.id, status)}
                          className="text-[#A88B5C] hover:text-[#8F7A52] transition-colors"
                          title="Change status"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5C5852]">
                    {date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewOrder(order.id)}
                      className="text-[#A88B5C] hover:text-[#8F7A52] transition-colors"
                      title="View details"
                    >
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

      {/* Order Detail Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-[#A88B5C]/10 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-[#2D2A26]">Order Details</h2>
                <p className="text-sm text-[#5C5852] mt-1">{selectedOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedOrder(null);
                  setEditingStatus(null);
                }}
                className="text-[#5C5852] hover:text-[#2D2A26] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-[#5C5852] mb-2 block">Order Status</label>
                    {editingStatus === selectedOrder.id.toString() ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="px-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
                          disabled={updating}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleSaveStatus(selectedOrder.id)}
                          disabled={updating}
                          className="px-4 py-2 bg-[#A88B5C] text-white rounded-lg hover:bg-[#8F7A52] transition-colors disabled:opacity-50"
                        >
                          {updating ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setEditingStatus(null);
                            setNewStatus("");
                          }}
                          disabled={updating}
                          className="px-4 py-2 border border-[#A88B5C] text-[#A88B5C] rounded-lg hover:bg-[#A88B5C] hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-sm rounded ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                        <button
                          onClick={() => handleStatusChange(selectedOrder.id, selectedOrder.status)}
                          className="text-[#A88B5C] hover:text-[#8F7A52] transition-colors flex items-center gap-1"
                        >
                          <Edit2 size={16} />
                          <span className="text-sm">Change Status</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#5C5852]">Total Amount</div>
                    <div className="text-2xl font-bold text-[#A88B5C]">
                      ${selectedOrder.total?.toFixed(2) || "0.00"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-[#2D2A26] mb-4 flex items-center gap-2">
                    <User size={20} />
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-[#5C5852]">Name: </span>
                      <span className="font-medium text-[#2D2A26]">
                        {selectedOrder.user?.name || selectedOrder.customer?.name || "Guest"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#5C5852]">Email: </span>
                      <span className="font-medium text-[#2D2A26]">
                        {selectedOrder.user?.email || selectedOrder.customer?.email || "N/A"}
                      </span>
                    </div>
                    {selectedOrder.shipping?.phone && (
                      <div>
                        <span className="text-[#5C5852]">Phone: </span>
                        <span className="font-medium text-[#2D2A26]">
                          {selectedOrder.shipping.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#2D2A26] mb-4 flex items-center gap-2">
                    <MapPin size={20} />
                    Shipping Address
                  </h3>
                  {selectedOrder.shipping && typeof selectedOrder.shipping === 'object' ? (
                    <div className="space-y-1 text-sm text-[#5C5852]">
                      <div>{selectedOrder.shipping.firstName} {selectedOrder.shipping.lastName}</div>
                      <div>{selectedOrder.shipping.address}</div>
                      <div>
                        {selectedOrder.shipping.city}, {selectedOrder.shipping.state} {selectedOrder.shipping.zipCode}
                      </div>
                      <div>{selectedOrder.shipping.country}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-[#5C5852]">No shipping address available</div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-bold text-[#2D2A26] mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items && Array.isArray(selectedOrder.items) ? (
                    selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-[#F5F5F5] rounded-lg">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg border border-[#A88B5C]/10"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-[#2D2A26]">{item.name}</div>
                          <div className="text-sm text-[#5C5852]">Quantity: {item.quantity}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#A88B5C]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-[#5C5852]">
                            ${item.price.toFixed(2)} each
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-[#5C5852]">No items found</div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              {selectedOrder.payment && (
                <div>
                  <h3 className="text-lg font-bold text-[#2D2A26] mb-4 flex items-center gap-2">
                    <CreditCard size={20} />
                    Payment Information
                  </h3>
                  <div className="bg-[#F5F5F5] p-4 rounded-lg space-y-2 text-sm">
                    <div>
                      <span className="text-[#5C5852]">Method: </span>
                      <span className="font-medium text-[#2D2A26]">
                        {selectedOrder.payment.method || "Card"}
                      </span>
                    </div>
                    {selectedOrder.payment.cardLast4 && (
                      <div>
                        <span className="text-[#5C5852]">Card: </span>
                        <span className="font-medium text-[#2D2A26]">
                          **** **** **** {selectedOrder.payment.cardLast4}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order Notes */}
              <div>
                <h3 className="text-lg font-bold text-[#2D2A26] mb-4">Order Notes</h3>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Add notes about this order..."
                  rows={4}
                  className="w-full px-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
                />
                <button
                  onClick={() => handleSaveNotes(selectedOrder.id)}
                  disabled={updating}
                  className="mt-2 px-4 py-2 bg-[#A88B5C] text-white rounded-lg hover:bg-[#8F7A52] transition-colors disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Notes"}
                </button>
              </div>

              {/* Order Date */}
              <div className="flex items-center gap-2 text-sm text-[#5C5852]">
                <Calendar size={16} />
                <span>
                  Order placed: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : "N/A"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}


