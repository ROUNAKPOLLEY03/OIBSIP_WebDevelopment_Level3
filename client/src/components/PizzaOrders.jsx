import React, { useState, useEffect } from "react";
import {
  Clock,
  Package,
  CheckCircle,
  XCircle,
  Truck,
  Utensils,
} from "lucide-react";
import { pizzaAPI } from "../utils/api";

const PizzaOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await pizzaAPI.getUserOrders();
      const orderData = data;

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

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        text: "Pending",
        description: "Your order has been placed and is pending confirmation",
      },
      preparing: {
        icon: Utensils,
        color: "text-blue-600",
        bg: "bg-blue-100",
        text: "Preparing",
        description: "Your pizza is being prepared",
      },
      delivered: {
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-100",
        text: "Delivered",
        description: "Your pizza has been delivered",
      },
      cancelled: {
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-100",
        text: "Cancelled",
        description: "This order was cancelled",
      },
    };
    return configs[status] || configs.pending;
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100";
      case "created":
        return "text-blue-600 bg-blue-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const generatePizzaName = (order) => {
    if (!order.toppings || order.toppings.length === 0) {
      return `Plain ${order.crust} Pizza`;
    }
    if (order.toppings.length === 1) {
      return `${order.toppings[0]} ${order.crust} Pizza`;
    }
    if (order.toppings.length === 2) {
      return `${order.toppings[0]} & ${order.toppings[1]} Pizza`;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            My Pizza Orders
          </h1>
          <p className="text-gray-600">Track and view all your pizza orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All Orders" },
              { key: "preparing", label: "Preparing" },
              { key: "baking", label: "Baking" },
              { key: "ready", label: "Ready" },
              { key: "out_for_delivery", label: "Out for Delivery" },
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
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-600">
              {filter === "all"
                ? "You haven't placed any orders yet."
                : `No orders found with status: ${filter}`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {generatePizzaName(order)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Order ID: {order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">
                          ₹{order.totalPrice}
                        </div>
                        <div className="text-sm text-gray-500">
                          Qty: {order.quantity}
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color} mb-4`}
                    >
                      <StatusIcon className="w-4 h-4 mr-2" />
                      {statusConfig.text}
                    </div>

                    {/* Pizza Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">
                          Pizza Details
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Crust:</span>{" "}
                            {order.crust}
                          </p>
                          <p>
                            <span className="font-medium">Sauce:</span>{" "}
                            {order.sauce}
                          </p>
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

                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">
                          Payment Info
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>Payment Status:</span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(
                                order.paymentStatus
                              )}`}
                            >
                              {order.paymentStatus.toUpperCase()}
                            </span>
                          </div>
                          {order.payment && (
                            <>
                              <p>
                                <span className="font-medium">Payment ID:</span>{" "}
                                {order.payment?.paymentId ||
                                  Math.floor(
                                    Math.random() * (5000000 - 100000 + 1)
                                  ) + 100000}
                              </p>
                              <p>
                                <span className="font-medium">Order ID:</span>{" "}
                                {order.payment?.orderId ||
                                  Math.floor(
                                    Math.random() * (5000000 - 100000 + 1)
                                  ) + 100000}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Description */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">
                        {statusConfig.description}
                      </p>
                      {order.updatedAt !== order.createdAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Last updated: {formatDate(order.updatedAt)}
                        </p>
                      )}
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

export default PizzaOrders;
