import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function getStatusColor(status) {
  switch (status) {
    case "pending":
      return "#f59e0b"; // amber
    case "confirmed":
      return "#06b6d4"; // cyan
    case "preparing":
      return "#6366f1"; // indigo
    case "ready":
      return "#10b981"; // green
    case "on_the_way":
      return "#ef4444"; // red
    case "delivered":
      return "#059669"; // emerald
    case "cancelled":
      return "#6b7280"; // gray
    default:
      return "#374151"; // slate
  }
}

function capitalizeStatus(s) {
  if (!s) return "";
  return s
    .replace(/_/g, " ")
    .split(" ")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

export default function App() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/orders/admin/all`);
      const data = res?.data?.data || [];
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.patch(`${API_URL}/orders/admin/${orderId}/status`, {
        status,
      });
      // refresh
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status", err);
      setError("Failed to update order status");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = selectedStatus === "all" || o.status === selectedStatus;
    const q = query.trim().toLowerCase();
    if (!q) return matchesStatus;
    return (
      matchesStatus &&
      (`${o.orderNumber || ""}`.toLowerCase().includes(q) ||
        (o.user?.name || "").toLowerCase().includes(q) ||
        (o.user?.email || "").toLowerCase().includes(q))
    );
  });

  const statusFilters = [
    { key: "all", label: `All (${orders.length})` },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "preparing", label: "Preparing" },
    { key: "ready", label: "Ready" },
    { key: "on_the_way", label: "On The Way" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 p-6 app-bg">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 site-header">
          <div>
            <h1 className="text-2xl font-bold">Curry House — Admin</h1>
            <p className="text-sm text-slate-500 dark:text-slate-300">Order Management Dashboard</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order#, name or email"
              className="px-3 py-2 border rounded-md w-64 focus:outline-none"
            />
            <button
              onClick={fetchOrders}
              className="px-3 py-2 bg-slate-800 text-white rounded-md"
            >
              ↻ Refresh
            </button>
            <button
              onClick={() => setDark((d) => !d)}
              title="Toggle theme"
              className="px-3 py-2 rounded-md border bg-white/20 text-slate-800 dark:text-slate-100"
            >
              {dark ? "🌙" : "☀️"}
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/95 dark:bg-slate-800/70 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-300">Total Orders</div>
            <div className="text-2xl font-bold">{orders.length}</div>
          </div>
          <div className="bg-white/95 dark:bg-slate-800/70 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-300">Delivered</div>
            <div className="text-2xl font-bold">{orders.filter((o) => o.status === "delivered").length}</div>
          </div>
          <div className="bg-white/95 dark:bg-slate-800/70 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-300">In Progress</div>
            <div className="text-2xl font-bold">{orders.filter((o) => ["pending", "confirmed", "preparing"].includes(o.status)).length}</div>
          </div>
          <div className="bg-white/95 dark:bg-slate-800/70 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-300">Revenue</div>
            <div className="text-2xl font-bold">kr {orders.reduce((s, o) => s + (o.totalAmount || 0), 0).toLocaleString()}</div>
          </div>
        </section>

        <section className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {statusFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedStatus(f.key)}
                className={`whitespace-nowrap px-3 py-2 rounded-full font-semibold ${selectedStatus === f.key ? "bg-orange-500 text-white" : "bg-white border dark:bg-slate-700/20 dark:border-slate-600"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        <main className="space-y-4">
          {loading ? (
            <div className="text-center text-slate-600 dark:text-slate-300">Loading orders...</div>
          ) : error ? (
            <div className="text-center">
              <div className="text-red-500 mb-2">Error: {error}</div>
              <button onClick={fetchOrders} className="px-4 py-2 bg-orange-500 text-white rounded-md">Retry</button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center text-slate-500 dark:text-slate-300">No orders found</div>
          ) : (
            filteredOrders.map((order) => (
              <article key={order._id} className="bg-white/95 dark:bg-slate-800/70 p-4 rounded-lg shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-bold">Order #{order.orderNumber || order._id}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-300">{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: getStatusColor(order.status), color: '#fff' }}>
                      {capitalizeStatus(order.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-slate-500 dark:text-slate-300">Customer</div>
                    <div className="font-medium">{order.user?.name || 'N/A'}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-300">{order.user?.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 dark:text-slate-300">Delivery</div>
                    <div className="font-medium">{order.deliveryType || '-'} — kr {order.totalAmount || 0}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-300">{order.paymentMethod || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 dark:text-slate-300">Phone</div>
                    <div className="font-medium">{order.user?.phone || 'N/A'}</div>
                  </div>
                </div>

                {order.items?.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm text-slate-500 dark:text-slate-300 mb-2">Items</div>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <div className="font-medium">{item.quantity} x {item.name}</div>
                          <div className="font-semibold">kr {item.subtotal}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {order.deliveryAddress && (
                  <div className="mt-4">
                    <div className="text-sm text-slate-500 dark:text-slate-300">Delivery Address</div>
                    <div className="font-medium">{order.deliveryAddress.street}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-300">{order.deliveryAddress.city} {order.deliveryAddress.postalCode}</div>
                  </div>
                )}

                {order.specialInstructions && (
                  <div className="mt-4">
                    <div className="text-sm text-slate-500 dark:text-slate-300">Special Instructions</div>
                    <div className="font-medium">{order.specialInstructions}</div>
                  </div>
                )}

                <div className="mt-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="w-full md:w-1/3 border rounded-md p-2 bg-white/95 dark:bg-slate-700/80 dark:border-slate-600 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="on_the_way">On The Way</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </article>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
