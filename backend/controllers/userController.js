const User = require("../models/User");

exports.updateProfile = async (req, res) => {
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

    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while updating profile" });
  }
};

// Delivery address features removed from backend API.
// Address management endpoints were intentionally removed.

// Favorites
exports.addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.favorites.includes(req.params.menuItemId)) {
      return res
        .status(400)
        .json({ success: false, message: "Item already in favorites" });
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
};

exports.removeFavorite = async (req, res) => {
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
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.json({ success: true, data: user.favorites });
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching favorites",
    });
  }
};
