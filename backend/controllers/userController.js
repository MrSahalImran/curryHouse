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

// Addresses
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("deliveryAddresses");
    res.json({ success: true, data: user.deliveryAddresses || [] });
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { label, street, city, postalCode, country, isDefault } = req.body;
    if (!street || !city || !postalCode) {
      return res
        .status(400)
        .json({
          success: false,
          message: "street, city and postalCode are required",
        });
    }

    const user = await User.findById(req.user._id);
    const address = {
      label: label || "Home",
      street,
      city,
      postalCode,
      country: country || "Norway",
      isDefault: Boolean(isDefault),
    };

    if (address.isDefault) {
      user.deliveryAddresses.forEach((a) => (a.isDefault = false));
    } else if (user.deliveryAddresses.length === 0) {
      address.isDefault = true;
    }

    user.deliveryAddresses.push(address);
    await user.save();
    res.status(201).json({ success: true, data: user.deliveryAddresses });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { label, street, city, postalCode, country, isDefault } = req.body;
    const user = await User.findById(req.user._id);
    const address = user.deliveryAddresses.id(req.params.id);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    if (label !== undefined) address.label = label;
    if (street !== undefined) address.street = street;
    if (city !== undefined) address.city = city;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (country !== undefined) address.country = country;

    if (isDefault !== undefined) {
      if (isDefault) {
        user.deliveryAddresses.forEach((a) => (a.isDefault = false));
      }
      address.isDefault = Boolean(isDefault);
    }

    await user.save();
    res.json({ success: true, data: user.deliveryAddresses });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.deliveryAddresses.id(req.params.id);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }
    user.deliveryAddresses.forEach((a) => (a.isDefault = false));
    address.isDefault = true;
    await user.save();
    res.json({ success: true, data: user.deliveryAddresses });
  } catch (error) {
    console.error("Set default address error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.deliveryAddresses.id(req.params.id);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }
    address.remove();
    if (
      user.deliveryAddresses.length > 0 &&
      !user.deliveryAddresses.some((a) => a.isDefault)
    ) {
      user.deliveryAddresses[0].isDefault = true;
    }
    await user.save();
    res.json({ success: true, data: user.deliveryAddresses });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

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
    res
      .status(500)
      .json({
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
    res
      .status(500)
      .json({
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
    res
      .status(500)
      .json({
        success: false,
        message: "Server error while fetching favorites",
      });
  }
};
