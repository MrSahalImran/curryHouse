const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ordersController = require("../controllers/ordersController");

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post("/", auth, ordersController.createOrder);

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get("/", auth, ordersController.getOrders);

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get("/:id", auth, ordersController.getOrderById);

// @route   PATCH /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.patch("/:id/cancel", auth, ordersController.cancelOrder);

module.exports = router;
