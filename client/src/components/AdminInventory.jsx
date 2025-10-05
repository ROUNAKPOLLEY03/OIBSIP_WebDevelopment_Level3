import React, { useState, useEffect } from "react";

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/admin/inventory");
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateInventory = async (id, newStock, newThreshold) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/admin/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentStock: parseInt(newStock),
          threshold: parseInt(newThreshold),
        }),
      });
      const updatedItem = await response.json();

      setInventory(
        inventory.map((item) => (item._id === id ? updatedItem : item))
      );
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      base: "bg-blue-100 text-blue-800",
      sauce: "bg-red-100 text-red-800",
      cheese: "bg-yellow-100 text-yellow-800",
      veggie: "bg-green-100 text-green-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const isLowStock = (item) => item.currentStock <= item.threshold;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📦 Inventory Management</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {["base", "sauce", "cheese", "veggie"].map((category) => {
          const items = inventory.filter((item) => item.category === category);
          const lowStockCount = items.filter(isLowStock).length;

          return (
            <div key={category} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 capitalize">
                {category}s
              </h3>
              <p className="text-2xl font-bold">{items.length}</p>
              {lowStockCount > 0 && (
                <p className="text-red-600 text-sm">
                  ⚠️ {lowStockCount} low stock
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Current Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Threshold
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr
                key={item._id}
                className={isLowStock(item) ? "bg-red-50" : ""}
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingItem === item._id ? (
                    <input
                      type="number"
                      defaultValue={item.currentStock}
                      className="w-20 px-2 py-1 border rounded"
                      id={`stock-${item._id}`}
                    />
                  ) : (
                    <span
                      className={
                        isLowStock(item) ? "text-red-600 font-bold" : ""
                      }
                    >
                      {item.currentStock} {item.unit}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingItem === item._id ? (
                    <input
                      type="number"
                      defaultValue={item.threshold}
                      className="w-20 px-2 py-1 border rounded"
                      id={`threshold-${item._id}`}
                    />
                  ) : (
                    <span>{item.threshold}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isLowStock(item) ? (
                    <span className="text-red-600 font-bold">⚠️ Low Stock</span>
                  ) : (
                    <span className="text-green-600">✅ Good</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingItem === item._id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const newStock = document.getElementById(
                            `stock-${item._id}`
                          ).value;
                          const newThreshold = document.getElementById(
                            `threshold-${item._id}`
                          ).value;
                          updateInventory(item._id, newStock, newThreshold);
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        ✅
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ❌
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingItem(item._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✏️ Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventory;
