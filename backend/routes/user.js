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
// @route   GET /api/user/addresses
// @desc    Get user's delivery addresses
// @access  Private
router.get("/addresses", auth, userController.getAddresses);

// @route   POST /api/user/addresses
// @desc    Add a new delivery address
// @access  Private
router.post("/addresses", auth, userController.addAddress);

// @route   PUT /api/user/addresses/:id
// @desc    Update a delivery address
// @access  Private
router.put("/addresses/:id", auth, userController.updateAddress);

// @route   PATCH /api/user/addresses/:id/default
// @desc    Set a delivery address as default
// @access  Private
router.patch("/addresses/:id/default", auth, userController.setDefaultAddress);

// @route   DELETE /api/user/addresses/:id
// @desc    Delete a delivery address
// @access  Private
router.delete("/addresses/:id", auth, userController.deleteAddress);

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
