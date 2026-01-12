import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, ShoppingBag, Users } from "lucide-react";
import { ordersAPI, productsAPI, customersAPI, franchiseAPI } from "../../services/api";

interface AnalyticsStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  monthlyRevenue: number;
  monthlyOrders: number;
  newCustomers: number;
  avgOrderValue: number;
  repeatCustomerRate: number;
}

export function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AnalyticsStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    monthlyRevenue: 0,
    monthlyOrders: 0,
    newCustomers: 0,
    avgOrderValue: 0,
    repeatCustomerRate: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const [orders, products, customers, franchiseApps] = await Promise.all([
          ordersAPI.getAll().catch(() => []),
          productsAPI.getAll().catch(() => []),
          customersAPI.getAll().catch(() => []),
          franchiseAPI.getAll().catch(() => []),
        ]);

        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        const totalRevenue = orders.reduce(
          (sum: number, order: any) => sum + (order.total || 0),
          0
        );
        const totalOrders = orders.length;
        const totalCustomers = customers.length;
        const totalProducts = products.length;

        const monthlyOrdersArr = orders.filter((order: any) => {
          const created = order.createdAt ? new Date(order.createdAt) : null;
          return created && created >= thirtyDaysAgo;
        });
        const monthlyRevenue = monthlyOrdersArr.reduce(
          (sum: number, order: any) => sum + (order.total || 0),
          0
        );

        const newCustomersArr = customers.filter((customer: any) => {
          const created = customer.createdAt ? new Date(customer.createdAt) : null;
          return created && created >= thirtyDaysAgo;
        });

        const avgOrderValue =
          totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const ordersByCustomer: Record<string, number> = {};
        orders.forEach((order: any) => {
          const key =
            order.customer?.email ||
            order.customer?.id?.toString() ||
            order.user?.email ||
            "guest";
          ordersByCustomer[key] = (ordersByCustomer[key] || 0) + 1;
        });

        const customersWithMultipleOrders = Object.values(ordersByCustomer).filter(
          (count) => count > 1
        ).length;
        const repeatCustomerRate =
          totalCustomers > 0
            ? (customersWithMultipleOrders / totalCustomers) * 100
            : 0;

        setStats({
          totalRevenue,
          totalOrders,
          totalCustomers,
          totalProducts,
          monthlyRevenue,
          monthlyOrders: monthlyOrdersArr.length,
          newCustomers: newCustomersArr.length,
          avgOrderValue,
          repeatCustomerRate,
        });
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: `Last 30 days: ${formatCurrency(stats.monthlyRevenue)}`,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: formatNumber(stats.totalOrders),
      change: `Last 30 days: ${stats.monthlyOrders}`,
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      title: "Customers",
      value: formatNumber(stats.totalCustomers),
      change: `New (30 days): ${stats.newCustomers}`,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Avg. Order Value",
      value: formatCurrency(stats.avgOrderValue),
      change: `Repeat rate: ${stats.repeatCustomerRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "bg-[#A88B5C]",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A88B5C] mx-auto mb-4"></div>
          <p className="text-[#5C5852]">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2A26] mb-2">
          Analytics
        </h1>
        <p className="text-sm text-[#5C5852]">
          Track your business performance and insights
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white p-6 rounded-lg border border-[#A88B5C]/10 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="text-white" size={24} />
                </div>
                <div className="text-xs text-green-600 font-medium text-right max-w-[120px]">
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-[#2D2A26] mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-[#5C5852]">{stat.title}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Placeholder (still visual, but labels based on real data) */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-[#A88B5C]/10 shadow-sm">
          <h2 className="text-xl font-bold text-[#2D2A26] mb-2">
            Sales Overview (Last 30 Days)
          </h2>
          <p className="text-sm text-[#5C5852] mb-4">
            Revenue: <span className="font-semibold">{formatCurrency(stats.monthlyRevenue)}</span>{" "}
            · Orders:{" "}
            <span className="font-semibold">
              {formatNumber(stats.monthlyOrders)}
            </span>
          </p>
          <div className="h-64 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
            <p className="text-[#5C5852]">
              Chart would be rendered here using these real metrics
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-[#A88B5C]/10 shadow-sm">
          <h2 className="text-xl font-bold text-[#2D2A26] mb-2">
            Customer Insights
          </h2>
          <p className="text-sm text-[#5C5852] mb-4">
            New customers in last 30 days:{" "}
            <span className="font-semibold">
              {formatNumber(stats.newCustomers)}
            </span>
            <br />
            Repeat customer rate:{" "}
            <span className="font-semibold">
              {stats.repeatCustomerRate.toFixed(1)}%
            </span>
          </p>
          <div className="h-64 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
            <p className="text-[#5C5852]">
              Chart would be rendered here using real customer data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

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


