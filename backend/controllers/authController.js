const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendOtpToUser } = require("../utils/helper");

const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS);

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

    // Respond to client immediately, then send OTP in background so slow
    // SMTP or network timeouts don't cause client-side errors.
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: user.toJSON(),
    });

    // Fire-and-forget OTP send (best-effort). Errors are logged.
    sendOtpToUser(user).catch((e) => {
      console.warn(
        "Auto-send OTP failed during registration (background):",
        e && e.message ? e.message : e
      );
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

// Send OTP for password reset (forgot password)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    // Do not reveal whether user exists; still attempt to send OTP when found
    if (user) {
      await sendOtpToUser(user, { mode: "reset" });
    }

    return res.json({
      success: true,
      message: "If this email exists, an OTP has been sent",
    });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to process request" });
  }
};

// Reset password using OTP
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({
        success: false,
        message: "Email, OTP and newPassword are required",
      });

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

    // success - set new password
    user.password = newPassword;
    user.emailVerification = undefined;
    await user.save();

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to reset password" });
  }
};
