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

// @route   POST /api/menu/categories
// @desc    Create a new category (admin)
// @access  Public for now
router.post("/categories", menuController.createCategory);

// @route   DELETE /api/menu/categories/:name
// @desc    Delete a category by name (admin)
// @access  Public for now
router.delete("/categories/:name", menuController.deleteCategory);

// @route   GET /api/menu/popular/items
// @desc    Get popular menu items
// @access  Public
router.get("/popular/items", menuController.getPopularItems);

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get("/:id", menuController.getItemById);

// @route   POST /api/menu
// @desc    Create a new menu item (admin)
// @access  Public for now
router.post("/", menuController.createItem);

// Update item
router.put("/:id", menuController.updateItem);

// Delete item
router.delete("/:id", menuController.deleteItem);

module.exports = router;
