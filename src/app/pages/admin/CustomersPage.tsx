import { motion } from "motion/react";
import { useState } from "react";
import { Search, Mail, Phone, Calendar } from "lucide-react";

const customers = [
  { id: 1, name: "Sophia Laurent", email: "sophia@example.com", phone: "+1 (555) 123-4567", orders: 5, totalSpent: "$1,925", joinDate: "2025-06-15" },
  { id: 2, name: "Isabella Chen", email: "isabella@example.com", phone: "+1 (555) 234-5678", orders: 3, totalSpent: "$1,140", joinDate: "2025-08-22" },
  { id: 3, name: "Amélie Dubois", email: "amelie@example.com", phone: "+1 (555) 345-6789", orders: 2, totalSpent: "$490", joinDate: "2025-09-10" },
  { id: 4, name: "Emma Wilson", email: "emma@example.com", phone: "+1 (555) 456-7890", orders: 4, totalSpent: "$1,520", joinDate: "2025-07-05" },
  { id: 5, name: "Olivia Brown", email: "olivia@example.com", phone: "+1 (555) 567-8901", orders: 1, totalSpent: "$195", joinDate: "2025-10-18" },
];

export function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              {filteredCustomers.map((customer) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-[#FFF8E7] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#2D2A26]">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-[#5C5852]">
                        <Mail size={14} />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#5C5852]">
                        <Phone size={14} />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#2D2A26]">{customer.orders} orders</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#A88B5C]">{customer.totalSpent}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-[#5C5852]">
                      <Calendar size={14} />
                      {customer.joinDate}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


