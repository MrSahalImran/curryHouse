import { useState, useEffect, useRef } from "react";
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

function getInitials(name) {
  if (!name) return "C";
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatTimeAgo(d) {
  if (!d) return "";
  const sec = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (sec < 5) return "just now";
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
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
  const [lastUpdated, setLastUpdated] = useState(null);
  const prevCountRef = useRef(0);

  // Undo state
  const undoTimerRef = useRef(null);
  const [pendingUndo, setPendingUndo] = useState(null);

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

    // Poll for new orders silently every 8 seconds
    const interval = setInterval(() => {
      fetchOrders({ silent: true });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async (opts = { silent: false }) => {
    const { silent } = opts;
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/orders/admin/all`);
      const data = res?.data?.data || [];
      setOrders(data);
      setLastUpdated(new Date());
      prevCountRef.current = data.length;
    } catch (err) {
      console.error(err);
      if (!silent) setError(err?.message || "Failed to fetch orders");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await axios.patch(
        `${API_URL}/orders/admin/${orderId}/status`,
        {
          status,
        }
      );
      return { success: true, data: res?.data };
    } catch (err) {
      console.error("Failed to update status", err);
      return { success: false, error: err };
    }
  };

  // Optimistic status change with undo
  const statusChangeWithUndo = async (order, newStatus) => {
    if (!order || order.status === newStatus) return;
    const prevStatus = order.status;

    // Optimistically update UI
    setOrders((list) =>
      list.map((o) => (o._id === order._id ? { ...o, status: newStatus } : o))
    );

    // Clear existing undo timer
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }

    setPendingUndo({ orderId: order._id, prevStatus, newStatus });

    // Auto-clear undo after 8s
    undoTimerRef.current = setTimeout(() => {
      setPendingUndo(null);
      undoTimerRef.current = null;
    }, 8000);

    const res = await updateOrderStatus(order._id, newStatus);
    if (!res.success) {
      // revert
      setOrders((list) =>
        list.map((o) =>
          o._id === order._id ? { ...o, status: prevStatus } : o
        )
      );
      setPendingUndo(null);
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
        undoTimerRef.current = null;
      }
      setError("Failed to update order status");
    }
  };

  const undoStatusChange = async () => {
    if (!pendingUndo) return;
    const { orderId, prevStatus } = pendingUndo;

    // Optimistically revert UI
    setOrders((list) =>
      list.map((o) => (o._id === orderId ? { ...o, status: prevStatus } : o))
    );

    // clear timer + pending
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
    setPendingUndo(null);

    const res = await updateOrderStatus(orderId, prevStatus);
    if (!res.success) setError("Failed to revert order status");
  };

  const statusFilters = [
    { key: "all", label: `All (${orders.length})` },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "preparing", label: "Preparing" },
    { key: "ready", label: "Ready" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      selectedStatus === "all" || o.status === selectedStatus;
    const q = query.trim().toLowerCase();
    if (!q) return matchesStatus;
    return (
      matchesStatus &&
      (`${o.orderNumber || ""}`.toLowerCase().includes(q) ||
        (o.user?.name || "").toLowerCase().includes(q) ||
        (o.user?.email || "").toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 p-6 app-bg">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 site-header">
          <div>
            <h1 className="text-2xl font-bold">Curry House — Admin</h1>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Order Management Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order#, name or email"
              className="px-3 py-2 border rounded-md w-64 focus:outline-none"
            />
            <button
              onClick={() => fetchOrders()}
              className="px-3 py-2 bg-slate-800 text-white rounded-md"
            >
              ↻ Refresh
            </button>
            <div className="text-xs text-slate-500 dark:text-slate-300 ml-2">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                <span>Live</span>
                {lastUpdated ? (
                  <span className="ml-2">· {formatTimeAgo(lastUpdated)}</span>
                ) : null}
              </span>
            </div>
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
            <div className="text-sm text-slate-500 dark:text-slate-300">
              Total Orders
            </div>
            <div className="text-2xl font-bold">{orders.length}</div>
          </div>
          <div className="bg-white/95 dark:bg-slate-800/70 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-300">
              In Progress
            </div>
            <div className="text-2xl font-bold">
              {
                orders.filter((o) =>
                  ["pending", "confirmed", "preparing", "ready"].includes(
                    o.status
                  )
                ).length
              }
            </div>
          </div>
          <div className="bg-white/95 dark:bg-slate-800/70 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-300">
              Cancelled
            </div>
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status === "cancelled").length}
            </div>
          </div>
          <div className="bg-white/95 dark:bg-slate-800/70 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-300">
              Revenue
            </div>
            <div className="text-2xl font-bold">
              kr{" "}
              {orders
                .reduce((s, o) => s + (o.totalAmount || 0), 0)
                .toLocaleString()}
            </div>
          </div>
        </section>

        <section className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {statusFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedStatus(f.key)}
                className={`whitespace-nowrap px-3 py-2 rounded-full font-semibold ${
                  selectedStatus === f.key
                    ? "bg-orange-500 text-white"
                    : "bg-white border dark:bg-slate-700/20 dark:border-slate-600"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        <main className="space-y-4">
          {loading ? (
            <div className="text-center text-slate-600 dark:text-slate-300">
              Loading orders...
            </div>
          ) : error ? (
            <div className="text-center">
              <div className="text-red-500 mb-2">Error: {error}</div>
              <button
                onClick={() => fetchOrders()}
                className="px-4 py-2 bg-orange-500 text-white rounded-md"
              >
                Retry
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center text-slate-500 dark:text-slate-300">
              No orders found
            </div>
          ) : (
            filteredOrders.map((order) => (
              <article
                key={order._id}
                className="bg-white/95 dark:bg-slate-800/70 p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-0.5 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-3 w-56 md:w-72 min-w-0">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-300 font-semibold">
                        {getInitials(order.user?.name)}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-slate-500 dark:text-slate-300">
                        Order #{order.orderNumber || order._id}
                      </div>
                      <div className="text-base font-semibold truncate">
                        {order.user?.name || "Customer"}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                        kr {order.totalAmount || 0}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {order.paymentMethod || "-"}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {order.items?.length || 0} items
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 w-40">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: getStatusColor(order.status),
                          color: "#fff",
                        }}
                      >
                        {capitalizeStatus(order.status)}
                      </span>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          statusChangeWithUndo(order, e.target.value)
                        }
                        className="w-full border rounded-md p-2 bg-white/95 dark:bg-slate-700/80 dark:border-slate-600 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Order items list */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                  {order.items && order.items.length > 0 ? (
                    <div className="space-y-2">
                      {order.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between text-sm text-slate-700 dark:text-slate-200"
                        >
                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              {it.name || it.menuItem?.name || "Item"}{" "}
                              <span className="text-xs text-slate-500">
                                x{it.quantity || 1}
                              </span>
                            </div>
                            {it.extras && it.extras.length > 0 ? (
                              <div className="text-xs text-slate-500 mt-1">
                                Extras:{" "}
                                {it.extras
                                  .map((e) => {
                                    const label = e?.name || e?.id || e;
                                    return e?.quantity
                                      ? `${label} x${e.quantity}`
                                      : label;
                                  })
                                  .join(", ")}
                              </div>
                            ) : null}
                          </div>

                          <div className="ml-4 font-medium">
                            kr{" "}
                            {(
                              it.subtotal ??
                              (it.price && it.quantity
                                ? it.price * it.quantity
                                : 0)
                            ).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      No items listed
                    </div>
                  )}

                  {/* Order-level extras (if any) */}
                  {order.extras && order.extras.length > 0 ? (
                    <div className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                      <div className="font-medium">Extras</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {order.extras.map((ex, i) => (
                          <div key={i} className="flex justify-between">
                            <div>
                              {ex.name || ex.id}
                              {ex.quantity ? (
                                <span className="text-xs text-slate-500">
                                  {" "}
                                  x{ex.quantity}
                                </span>
                              ) : null}
                            </div>
                            <div>
                              kr{" "}
                              {(
                                ex.subtotal ??
                                (ex.price && ex.quantity
                                  ? ex.price * ex.quantity
                                  : ex.price || 0)
                              ).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                      {order.extrasTotal ? (
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                          Extras total: kr{" "}
                          {Number(order.extrasTotal).toLocaleString()}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {order.specialInstructions ? (
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Note: {order.specialInstructions}
                    </div>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </main>

        {/* Undo toast */}
        {pendingUndo ? (
          <div className="fixed right-6 bottom-6 bg-white dark:bg-slate-800 border rounded-lg shadow-md p-3 flex items-center gap-4">
            <div className="text-sm">
              Status changed to{" "}
              <strong>{capitalizeStatus(pendingUndo.newStatus)}</strong>
            </div>
            <button
              onClick={undoStatusChange}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-sm font-semibold"
            >
              Undo
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
