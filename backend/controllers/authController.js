const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendOtpToUser } = require("../utils/helper");

const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS) || 5;

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
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

    // Send OTP on registration (best-effort)
    try {
      await sendOtpToUser(user);
    } catch (e) {
      console.warn(
        "Auto-send OTP failed during registration:",
        e && e.message ? e.message : e
      );
    }
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

// Send OTP to user's email for verification
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    await sendOtpToUser(user);
    return res.json({ success: true, message: "OTP sent to email" });
  } catch (mailErr) {
    console.warn(
      "Failed to send verification email:",
      mailErr && mailErr.message ? mailErr.message : mailErr
    );
  }

  return res.json({ success: true, message: "OTP sent to email" });
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const ev = user.emailVerification;
    if (!ev || !ev.otpHash)
      return res
        .status(400)
        .json({ success: false, message: "No OTP requested" });

    if (ev.expiresAt && new Date() > new Date(ev.expiresAt)) {
      return res.status(410).json({ success: false, message: "OTP expired" });
    }

    if (ev.attempts >= OTP_MAX_ATTEMPTS) {
      return res
        .status(429)
        .json({ success: false, message: "Too many attempts" });
    }

    const match = await bcrypt.compare(otp, ev.otpHash);
    if (!match) {
      user.emailVerification.attempts =
        (user.emailVerification.attempts || 0) + 1;
      await user.save();
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    // success
    user.isEmailVerified = true;
    user.emailVerification = undefined;
    await user.save();

    return res.json({ success: true, message: "Email verified" });
  } catch (err) {
    console.error("verifyOtp error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to verify OTP" });
  }
};
