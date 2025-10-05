import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Utensils,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Calendar,
  RefreshCw,
  PieChart,
} from "lucide-react";
import { adminAPI } from "../utils/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const statsData = await adminAPI.getAdminStats();
      setStats(statsData);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to load dashboard statistics. Please try again.");
      console.error("Error loading stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        bgCard: "bg-yellow-50",
        border: "border-yellow-200",
        text: "Pending Orders",
      },
      preparing: {
        icon: Utensils,
        color: "text-blue-600",
        bg: "bg-blue-100",
        bgCard: "bg-blue-50",
        border: "border-blue-200",
        text: "Preparing",
      },
      delivered: {
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-100",
        bgCard: "bg-green-50",
        border: "border-green-200",
        text: "Delivered",
      },
      cancelled: {
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-100",
        bgCard: "bg-red-50",
        border: "border-red-200",
        text: "Cancelled",
      },
    };
    return configs[status] || configs.pending;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadStats}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Overview of pizza orders and business metrics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <div className="text-sm text-gray-500 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Last updated: {formatDate(lastUpdated)}
              </div>
            )}
            <button
              onClick={loadStats}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totals.orders}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <ShoppingBag className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {formatCurrency(stats.totals.revenue)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Average Order Value
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totals.orders > 0
                    ? formatCurrency(stats.totals.revenue / stats.totals.orders)
                    : formatCurrency(0)}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Order Status Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(stats.statusStats).map(([status, data]) => {
              const config = getStatusConfig(status);
              const StatusIcon = config.icon;
              const percentage =
                stats.totals.orders > 0
                  ? ((data.count / stats.totals.orders) * 100).toFixed(1)
                  : 0;

              return (
                <div
                  key={status}
                  className={`${config.bgCard} ${config.border} border rounded-lg p-4`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`${config.bg} p-2 rounded-full`}>
                      <StatusIcon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {percentage}%
                    </span>
                  </div>

                  <div className="mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {data.count}
                    </h3>
                    <p className="text-sm text-gray-600">{config.text}</p>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p className="font-medium">
                      Revenue: {formatCurrency(data.revenue)}
                    </p>
                    <p>
                      Avg:{" "}
                      {data.count > 0
                        ? formatCurrency(data.revenue / data.count)
                        : formatCurrency(0)}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          status === "pending"
                            ? "bg-yellow-500"
                            : status === "preparing"
                            ? "bg-blue-500"
                            : status === "delivered"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Success Rate */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Success Rate
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.totals.orders > 0
                  ? (
                      (stats.statusStats.delivered.count /
                        stats.totals.orders) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </div>
              <p className="text-sm text-gray-600">
                Orders successfully delivered
              </p>
            </div>
          </div>

          {/* Active Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Active Orders
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.statusStats.pending.count +
                  stats.statusStats.preparing.count}
              </div>
              <p className="text-sm text-gray-600">Orders in progress</p>
            </div>
          </div>

          {/* Cancellation Rate */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Cancellation Rate
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {stats.totals.orders > 0
                  ? (
                      (stats.statusStats.cancelled.count /
                        stats.totals.orders) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </div>
              <p className="text-sm text-gray-600">Orders cancelled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
