const MenuItem = require("../models/MenuItem");

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
    res.json({ success: true, count: menuItems.length, data: menuItems });
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
    res.json({ success: true, data: menuItem });
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
    res.json({ success: true, count: popularItems.length, data: popularItems });
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
