const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

// -------------------- PROFILE --------------------
// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, userController.updateProfile);

// -------------------- DELIVERY ADDRESSES --------------------
// Delivery address endpoints removed

// -------------------- FAVORITES --------------------
// @route   POST /api/user/favorites/:menuItemId
// @desc    Add item to favorites
// @access  Private
router.post("/favorites/:menuItemId", auth, userController.addFavorite);

// @route   DELETE /api/user/favorites/:menuItemId
// @desc    Remove item from favorites
// @access  Private
router.delete("/favorites/:menuItemId", auth, userController.removeFavorite);

// @route   GET /api/user/favorites
// @desc    Get user's favorites
// @access  Private
router.get("/favorites", auth, userController.getFavorites);

module.exports = router;
