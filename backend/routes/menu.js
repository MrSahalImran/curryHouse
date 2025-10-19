const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");

// @route   GET /api/menu
// @desc    Get all menu items
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category, tag, search } = req.query;
    let query = {};

    // Filter by category
    if (category && category !== "All") {
      query.category = category;
    }

    // Filter by tag
    if (tag) {
      query.tags = tag;
    }

    // Search by name or description
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

    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    console.error("Get menu error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching menu items",
    });
  }
});

// @route   GET /api/menu/categories
// @desc    Get all categories
// @access  Public
router.get("/categories", async (req, res) => {
  try {
    const categories = await MenuItem.distinct("category");

    res.json({
      success: true,
      data: ["All", ...categories],
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
    });
  }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    console.error("Get menu item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching menu item",
    });
  }
});

// @route   GET /api/menu/popular/items
// @desc    Get popular menu items
// @access  Public
router.get("/popular/items", async (req, res) => {
  try {
    const popularItems = await MenuItem.find({ isPopular: true }).limit(10);

    res.json({
      success: true,
      count: popularItems.length,
      data: popularItems,
    });
  } catch (error) {
    console.error("Get popular items error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching popular items",
    });
  }
});

module.exports = router;
