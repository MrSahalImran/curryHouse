const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

// @route   GET /api/menu
// @desc    Get all menu items
// @access  Public
router.get("/", menuController.getMenu);

// @route   GET /api/menu/categories
// @desc    Get all categories
// @access  Public
router.get("/categories", menuController.getCategories);

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get("/:id", menuController.getItemById);

// @route   GET /api/menu/popular/items
// @desc    Get popular menu items
// @access  Public
router.get("/popular/items", menuController.getPopularItems);

module.exports = router;
