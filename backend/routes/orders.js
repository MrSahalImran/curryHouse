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

// Admin routes (temporarily without auth for testing)
// @route   GET /api/orders/admin/all
// @desc    Get all orders (admin)
// @access  Public (should be admin-only in production)
router.get("/admin/all", ordersController.getAllOrders);

// @route   PATCH /api/orders/admin/:id/status
// @desc    Update order status (admin)
// @access  Public (should be admin-only in production)
router.patch("/admin/:id/status", ordersController.updateOrderStatus);

module.exports = router;
