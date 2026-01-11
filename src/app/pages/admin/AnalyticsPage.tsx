import { motion } from "motion/react";
import { TrendingUp, DollarSign, ShoppingBag, Users } from "lucide-react";

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2A26] mb-2">Analytics</h1>
        <p className="text-sm text-[#5C5852]">Track your business performance and insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { title: "Revenue", value: "$124,580", change: "+12.5%", icon: DollarSign, color: "bg-green-500" },
          { title: "Orders", value: "1,247", change: "+8.2%", icon: ShoppingBag, color: "bg-blue-500" },
          { title: "Customers", value: "892", change: "+15.3%", icon: Users, color: "bg-purple-500" },
          { title: "Growth", value: "24.8%", change: "+5.2%", icon: TrendingUp, color: "bg-[#A88B5C]" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white p-6 rounded-lg border border-[#A88B5C]/10 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className="text-sm text-green-600 font-medium">{stat.change}</div>
              </div>
              <div className="text-2xl font-bold text-[#2D2A26] mb-1">{stat.value}</div>
              <div className="text-sm text-[#5C5852]">{stat.title}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Placeholder */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-[#A88B5C]/10 shadow-sm">
          <h2 className="text-xl font-bold text-[#2D2A26] mb-4">Sales Overview</h2>
          <div className="h-64 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
            <p className="text-[#5C5852]">Chart would be rendered here</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-[#A88B5C]/10 shadow-sm">
          <h2 className="text-xl font-bold text-[#2D2A26] mb-4">Customer Growth</h2>
          <div className="h-64 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
            <p className="text-[#5C5852]">Chart would be rendered here</p>
          </div>
        </div>
      </div>
    </div>
  );
}


