import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function ManageMenu({ onEdit }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/menu`);
      setItems(res.data?.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/menu/categories`);
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this menu item?")) return;
    try {
      await axios.delete(`${API_URL}/menu/${id}`);
      setItems((s) => s.filter((i) => i._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      const msg =
        err?.response?.data?.message || err.message || "Failed to delete";
      alert(msg);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory || !newCategory.trim())
      return alert("Enter a category name");
    try {
      const res = await axios.post(`${API_URL}/menu/categories`, {
        name: newCategory.trim(),
      });
      alert(`Category created: ${res.data?.data?.name || newCategory}`);
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error("Create category error", err);
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to create category";
      alert(msg);
    }
  };

  const handleDeleteCategory = async (name) => {
    if (!confirm(`Delete category '${name}'?`)) return;
    try {
      await axios.delete(
        `${API_URL}/menu/categories/${encodeURIComponent(name)}`
      );
      fetchCategories();
    } catch (err) {
      console.error("Delete category error", err);
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to delete category";
      alert(msg);
    }
  };

  return (
    <div className="bg-white/95 dark:bg-slate-800/70 p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Manage Menu</h2>
        <button
          onClick={() => onEdit(null)}
          className="px-3 py-1 bg-green-600 text-white rounded-md"
        >
          + New Item
        </button>
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-2">Categories</h3>
        <div className="flex gap-2 mb-2">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="px-2 py-1 border rounded w-64"
          />
          <button
            onClick={handleAddCategory}
            className="px-3 py-1 bg-blue-600 text-white rounded-md"
          >
            Add Category
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <div
              key={c}
              className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded"
            >
              <span className="text-sm">{c}</span>
              {c !== "All" && (
                <button
                  onClick={() => handleDeleteCategory(c)}
                  className="text-xs text-red-600 px-1"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => {
            // compute absolute image URL if backend returned relative path
            const baseHost = API_URL.replace(/\/api\/?$/, "");
            const imageSrc = it?.image
              ? it.image.startsWith("http")
                ? it.image
                : `${baseHost}${it.image}`
              : null;

            return (
              <div
                key={it._id}
                className="flex items-center justify-between p-3 rounded-md bg-white/80 dark:bg-slate-700/60 border"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={imageSrc}
                    alt={it.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/160x112?text=No+Image";
                    }}
                    className="w-20 h-14 object-cover rounded"
                  />
                  <div>
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-sm text-slate-500">kr {it.price}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(it)}
                    className="px-3 py-1 bg-slate-200 dark:bg-slate-600 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(it._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
