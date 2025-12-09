import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://curry-house-eight.vercel.app/api";

export default function AddMenuItem({ onBack, initial = null, onSaved }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("Biryani");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (initial) {
      setName(initial.name || "");
      setDescription(initial.description || "");
      setPrice(initial.price || 0);
      setCategory(initial.category || "Biryani");
      setTags((initial.tags || []).join(", "));
    }
    // fetch categories for select
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/menu/categories`);
        const data = res.data?.data || [];
        // remove "All" if present
        const filtered = data.filter((c) => c !== "All");
        setCategories(filtered);
        if (!initial) setCategory(filtered[0] || "Biryani");
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    };

    fetchCategories();
  }, [initial]);

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setImageFile(f || null);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    const fd = new FormData();
    fd.append("image", imageFile);
    const res = await axios.post(`${API_URL}/uploads`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // prefer returned path if available
    return res.data?.data?.path || res.data?.data?.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      let imageVal = initial?.image || null;
      if (imageFile) {
        const uploaded = await uploadImage();
        imageVal = uploaded;
      }

      const payload = {
        name,
        description,
        price,
        category,
        tags,
        image: imageVal,
      };

      let res;
      if (initial && initial._id) {
        res = await axios.put(`${API_URL}/menu/${initial._id}`, payload);
      } else {
        res = await axios.post(`${API_URL}/menu`, payload);
      }

      if (res.data?.success) {
        setMessage(
          initial ? "Menu item updated" : "Menu item created successfully"
        );
        // clear form if new
        if (!initial) {
          setName("");
          setDescription("");
          setPrice(0);
          setCategory("Biryani");
          setTags("");
          setImageFile(null);
        }
        if (onSaved) onSaved(res.data.data);
      } else {
        setMessage("Failed to save menu item");
      }
    } catch (err) {
      console.error("Save error:", err);
      const msg =
        err?.response?.data?.message || err.message || "Error saving item";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/95 dark:bg-slate-800/70 p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          {initial ? "Edit" : "Add"} Menu Item
        </h2>
        <button
          onClick={onBack}
          className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-md"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              required
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 focus:outline-none"
            >
              {categories.length ? (
                categories.map((c) => <option key={c}>{c}</option>)
              ) : (
                <>
                  <option>Biryani</option>
                  <option>Kebab</option>
                  <option>Drinks</option>
                  <option>Naan</option>
                  <option>Curry</option>
                  <option>Appetizers</option>
                  <option>Desserts</option>
                  <option>Combo Meals</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font medium">Tags (comma)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {imageFile ? (
            <div className="text-sm mt-2">Selected: {imageFile.name}</div>
          ) : initial?.image ? (
            <div className="text-sm mt-2">Current: {initial.image}</div>
          ) : null}
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded-md"
          >
            {loading ? "Saving..." : initial ? "Update Item" : "Create Item"}
          </button>
        </div>

        {message ? <div className="text-sm mt-2">{message}</div> : null}
      </form>
    </div>
  );
}
