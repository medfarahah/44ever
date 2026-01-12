import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Search, Mail, Phone, Calendar, Plus, X, Edit2, Trash2, Save } from "lucide-react";
import { customersAPI, ordersAPI } from "../../services/api";

export function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    }
  });
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
      }
    });
    setShowAddModal(true);
  };

  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address && typeof customer.address === 'object' ? {
        street: customer.address.street || "",
        city: customer.address.city || "",
        state: customer.address.state || "",
        zipCode: customer.address.zipCode || "",
        country: customer.address.country || ""
      } : {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
      }
    });
    setShowAddModal(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      alert("Name and email are required");
      return;
    }

    try {
      setSaving(true);
      
      if (editingCustomer) {
        // Update existing customer
        await customersAPI.update(editingCustomer.id, formData);
        alert("Customer updated successfully!");
      } else {
        // Create new customer
        await customersAPI.create(formData);
        alert("Customer added successfully!");
      }
      
      // Refresh customers list
      await fetchData();
      
      // Close modal and reset form
      setShowAddModal(false);
      setEditingCustomer(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: ""
        }
      });
    } catch (error: any) {
      console.error("Failed to save customer:", error);
      alert(`Failed to save customer: ${error.message || 'Please try again'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCustomer = async (customerId: number, customerName: string) => {
    if (!confirm(`Are you sure you want to delete customer "${customerName}"?`)) {
      return;
    }

    try {
      await customersAPI.delete(customerId);
      alert("Customer deleted successfully!");
      await fetchData();
    } catch (error: any) {
      console.error("Failed to delete customer:", error);
      alert(`Failed to delete customer: ${error.message || 'Please try again'}`);
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2A26] mb-2">Customers</h1>
          <p className="text-sm text-[#5C5852]">Manage your customer database</p>
        </div>
        <button
          onClick={handleAddCustomer}
          className="flex items-center gap-2 px-4 py-2 bg-[#A88B5C] text-white rounded-lg hover:bg-[#8F7A52] transition-colors text-sm"
        >
          <Plus size={18} />
          Add Customer
        </button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Actions</th>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditCustomer(customer)}
                            className="text-[#A88B5C] hover:text-[#8F7A52] transition-colors"
                            title="Edit customer"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                            title="Delete customer"
                          >
                            <Trash2 size={16} />
                          </button>
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

      {/* Add/Edit Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#2D2A26]">
                {editingCustomer ? "Edit Customer" : "Add New Customer"}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCustomer(null);
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    address: {
                      street: "",
                      city: "",
                      state: "",
                      zipCode: "",
                      country: ""
                    }
                  });
                }}
                className="text-[#5C5852] hover:text-[#2D2A26]"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-4">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#2D2A26] mb-3">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#5C5852] mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#5C5852] mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[#5C5852] mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#2D2A26] mb-3">Address Information</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-[#5C5852] mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="street"
                      value={formData.address.street}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, street: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-[#5C5852] mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={formData.address.city}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, city: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-[#5C5852] mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        value={formData.address.state}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, state: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-[#5C5852] mb-1">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        value={formData.address.zipCode}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, zipCode: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-[#5C5852] mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        value={formData.address.country}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, country: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t border-[#A88B5C]/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCustomer(null);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      address: {
                        street: "",
                        city: "",
                        state: "",
                        zipCode: "",
                        country: ""
                      }
                    });
                  }}
                  className="px-6 py-2 border border-[#A88B5C] text-[#A88B5C] rounded-lg hover:bg-[#A88B5C] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#A88B5C] text-white rounded-lg shadow-md hover:bg-[#8F7A52] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {editingCustomer ? "Update Customer" : "Add Customer"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
