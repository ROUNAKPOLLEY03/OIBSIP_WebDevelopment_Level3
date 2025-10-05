import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Utensils,
  User,
  Calendar,
} from "lucide-react";
import { adminAPI } from "../utils/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const orderData = await adminAPI.getAllOrders();
      // Sort orders by creation date (newest first)
      const sortedOrders = orderData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    } catch (err) {
      setError("Failed to load orders. Please try again.");
      console.error("Error loading orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      await adminAPI.updateOrderStatus(orderId, newStatus);

      // Update local state
      setOrders(
        orders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : order
        )
      );
    } catch (err) {
      setError("Failed to update order status. Please try again.");
      console.error("Error updating order:", err);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        text: "Pending",
      },
      preparing: {
        icon: Utensils,
        color: "text-blue-600",
        bg: "bg-blue-100",
        text: "Preparing",
      },
      delivered: {
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-100",
        text: "Delivered",
      },
      cancelled: {
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-100",
        text: "Cancelled",
      },
    };
    return configs[status] || configs.pending;
  };

  const generatePizzaName = (order) => {
    if (!order.toppings || order.toppings.length === 0) {
      return `Plain ${order.crust} Pizza`;
    }
    if (order.toppings.length === 1) {
      return `${order.toppings[0]} ${order.crust} Pizza`;
    }
    return `${order.toppings[0]} & ${order.toppings.length - 1} More Pizza`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const getOrderCount = (status) => {
    if (status === "all") return orders.length;
    return orders.filter((order) => order.status === status).length;
  };

  const getStatusDropdown = (order) => {
    const statusOptions = [
      { value: "pending", label: "Pending", color: "text-yellow-600" },
      { value: "preparing", label: "Preparing", color: "text-blue-600" },
      { value: "delivered", label: "Delivered", color: "text-green-600" },
      { value: "cancelled", label: "Cancelled", color: "text-red-600" },
    ];

    return (
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Update Status:
        </label>
        <select
          value={order.status}
          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
          disabled={updatingOrder === order._id}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {updatingOrder === order._id && (
          <p className="text-sm text-gray-500 mt-1">Updating status...</p>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
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
            onClick={loadOrders}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Order Management
          </h1>
          <p className="text-gray-600">Manage and track all pizza orders</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { status: "pending", label: "Pending", color: "bg-yellow-500" },
            { status: "preparing", label: "Preparing", color: "bg-blue-500" },
            { status: "delivered", label: "Delivered", color: "bg-green-500" },
            { status: "cancelled", label: "Cancelled", color: "bg-red-500" },
          ].map(({ status, label, color }) => (
            <div key={status} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${color} mr-3`}></div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {getOrderCount(status)}
                  </div>
                  <div className="text-sm text-gray-600">{label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All Orders" },
              { key: "pending", label: "Pending" },
              { key: "preparing", label: "Preparing" },
              { key: "delivered", label: "Delivered" },
              { key: "cancelled", label: "Cancelled" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {label} ({getOrderCount(key)})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-600">
              {filter === "all"
                ? "No orders have been placed yet."
                : `No orders found with status: ${filter}`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {generatePizzaName(order)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}
                        >
                          <StatusIcon className="w-4 h-4 mr-2" />
                          {statusConfig.text}
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-center mb-4 text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        <span className="font-medium">{order.userId.name}</span>
                        <span className="ml-2">({order.userId.email})</span>
                      </div>

                      {/* Pizza Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p>
                            <span className="font-medium">Crust:</span>{" "}
                            {order.crust}
                          </p>
                          <p>
                            <span className="font-medium">Sauce:</span>{" "}
                            {order.sauce}
                          </p>
                          <p>
                            <span className="font-medium">Quantity:</span>{" "}
                            {order.quantity}
                          </p>
                        </div>
                        <div>
                          {order.cheeses && order.cheeses.length > 0 && (
                            <p>
                              <span className="font-medium">Cheese:</span>{" "}
                              {order.cheeses.join(", ")}
                            </p>
                          )}
                          {order.toppings && order.toppings.length > 0 && (
                            <p>
                              <span className="font-medium">Toppings:</span>{" "}
                              {order.toppings.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status Dropdown */}
                      {getStatusDropdown(order)}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-gray-800">
                          ₹{order.totalPrice}
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          Payment: {order.paymentStatus.toUpperCase()}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Ordered: {formatDate(order.createdAt)}</span>
                        </div>
                        {order.updatedAt !== order.createdAt && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Updated: {formatDate(order.updatedAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
