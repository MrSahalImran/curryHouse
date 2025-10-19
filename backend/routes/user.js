const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;
    if (avatar) updateFields.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
});

// @route   POST /api/user/favorites/:menuItemId
// @desc    Add item to favorites
// @access  Private
router.post("/favorites/:menuItemId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.favorites.includes(req.params.menuItemId)) {
      return res.status(400).json({
        success: false,
        message: "Item already in favorites",
      });
    }

    user.favorites.push(req.params.menuItemId);
    await user.save();

    res.json({
      success: true,
      message: "Item added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Add favorite error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding to favorites",
    });
  }
});

// @route   DELETE /api/user/favorites/:menuItemId
// @desc    Remove item from favorites
// @access  Private
router.delete("/favorites/:menuItemId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.menuItemId
    );
    await user.save();

    res.json({
      success: true,
      message: "Item removed from favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Remove favorite error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while removing from favorites",
    });
  }
});

// @route   GET /api/user/favorites
// @desc    Get user's favorites
// @access  Private
router.get("/favorites", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");

    res.json({
      success: true,
      data: user.favorites,
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching favorites",
    });
  }
});

module.exports = router;
