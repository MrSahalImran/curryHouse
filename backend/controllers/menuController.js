const MenuItem = require("../models/MenuItem");

// Helper to compute a public, reachable image URL for responses
function publicImageUrl(image, req) {
  if (!image) return null;
  const host = req.get("host");
  const proto = req.protocol;

  // If absolute but points to localhost/127.0.0.1, rewrite host to request host
  if (/^https?:\/\//i.test(image)) {
    try {
      const urlObj = new URL(image);
      if (urlObj.hostname === "localhost" || urlObj.hostname === "127.0.0.1") {
        return `${proto}://${host}${urlObj.pathname}${urlObj.search || ""}${urlObj.hash || ""}`;
      }
      return image; // absolute and not localhost
    } catch (e) {
      return image;
    }
  }

  // If relative path like /uploads/xxx
  if (image.startsWith("/")) {
    return `${proto}://${host}${image}`;
  }

  // Otherwise assume it's a filename under /uploads
  return `${proto}://${host}/uploads/${image}`;
}

exports.getMenu = async (req, res) => {
  try {
    const { category, tag, search } = req.query;
    let query = {};
    if (category && category !== "All") query.category = category;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const menuItems = await MenuItem.find(query).sort({
      isPopular: -1,
      createdAt: -1,
    });
    // Map images to public URLs for the client (avoid requiring mobile changes)
    const mapped = menuItems.map((mi) => {
      const obj = mi.toObject ? mi.toObject() : { ...mi };
      obj.image = publicImageUrl(obj.image, req) || obj.image;
      return obj;
    });
    res.json({ success: true, count: mapped.length, data: mapped });
  } catch (error) {
    console.error("Get menu error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching menu items",
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await MenuItem.distinct("category");
    res.json({ success: true, data: ["All", ...categories] });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
    });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem)
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    const obj = menuItem.toObject ? menuItem.toObject() : { ...menuItem };
    obj.image = publicImageUrl(obj.image, req) || obj.image;
    res.json({ success: true, data: obj });
  } catch (error) {
    console.error("Get menu item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching menu item",
    });
  }
};

exports.getPopularItems = async (req, res) => {
  try {
    const popularItems = await MenuItem.find({ isPopular: true }).limit(10);
    const mapped = popularItems.map((mi) => {
      const obj = mi.toObject ? mi.toObject() : { ...mi };
      obj.image = publicImageUrl(obj.image, req) || obj.image;
      return obj;
    });
    res.json({ success: true, count: mapped.length, data: mapped });
  } catch (error) {
    console.error("Get popular items error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching popular items",
    });
  }
};

// Create a new menu item (admin)
exports.createItem = async (req, res) => {
  try {
    const { name, description, price, category, tags, image } = req.body;
    if (!name || !description || !price || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const tagsArray = Array.isArray(tags)
      ? tags
      : typeof tags === "string" && tags.length
      ? tags.split(",").map((t) => t.trim())
      : [];

    const menuItem = new MenuItem({
      name,
      description,
      price: Number(price),
      category,
      tags: tagsArray,
      image: image || undefined,
    });

    await menuItem.save();
    res.json({ success: true, data: menuItem });
  } catch (error) {
    console.error("Create menu item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating menu item",
    });
  }
};
