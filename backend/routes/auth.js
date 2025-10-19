const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const authController = require("../controllers/authController");

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    body("phone")
      .matches(/^[0-9]{8,15}$/)
      .withMessage("Please enter a valid phone number"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  authController.register
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  authController.login
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", auth, authController.me);

module.exports = router;
