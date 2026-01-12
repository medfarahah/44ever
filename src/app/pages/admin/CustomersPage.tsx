import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Search, Mail, Phone, Calendar } from "lucide-react";
import { customersAPI, ordersAPI } from "../../services/api";

export function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customersData, ordersData] = await Promise.all([
          customersAPI.getAll().catch(() => []),
          ordersAPI.getAll().catch(() => [])
        ]);
        setCustomers(customersData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate customer statistics
  const getCustomerStats = (customerId: number) => {
    const customerOrders = orders.filter(order => 
      order.customer?.id === customerId || order.user?.id === customerId
    );
    const orderCount = customerOrders.length;
    const totalSpent = customerOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    return { orderCount, totalSpent };
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A88B5C] mx-auto mb-4"></div>
          <p className="text-[#5C5852]">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2A26] mb-2">Customers</h1>
        <p className="text-sm text-[#5C5852]">Manage your customer database</p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border border-[#A88B5C]/10 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5852]" size={20} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
          />
        </div>
      </div>

      {/* Customers Table */}
      {filteredCustomers.length > 0 ? (
        <div className="bg-white rounded-lg border border-[#A88B5C]/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F5F5]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Total Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => {
                  const stats = getCustomerStats(customer.id);
                  return (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-[#FFF8E7] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#2D2A26]">{customer.name || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {customer.email && (
                            <div className="flex items-center gap-2 text-sm text-[#5C5852]">
                              <Mail size={14} />
                              {customer.email}
                            </div>
                          )}
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-sm text-[#5C5852]">
                              <Phone size={14} />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#2D2A26]">{stats.orderCount} orders</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#A88B5C]">{formatCurrency(stats.totalSpent)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-[#5C5852]">
                          <Calendar size={14} />
                          {formatDate(customer.createdAt)}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-lg border border-[#A88B5C]/10 shadow-sm text-center">
          <div className="text-[#5C5852]">
            {searchTerm ? (
              <>
                <p className="text-lg mb-2">No customers found</p>
                <p className="text-sm">Try a different search term</p>
              </>
            ) : (
              <>
                <p className="text-lg mb-2">No customers yet</p>
                <p className="text-sm">Customers will appear here after they place orders</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
