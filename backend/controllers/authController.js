const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || "sldkfjasldkfjlaskdjflkas";
  return jwt.sign({ userId }, secret, { expiresIn: "30d" });
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, password, address } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    user = new User({ name, email, phone, password, address: address || {} });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during login" });
  }
};

exports.me = async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
