const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      deliveryType,
      paymentMethod,
      specialInstructions,
      extras,
      extrasTotal,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    const totalAmount =
      req.body.totalAmount ||
      items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Delivery address handling removed — orders no longer store deliveryAddress

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}`;

    const order = new Order({
      user: req.user._id,
      orderNumber,
      items,
      totalAmount,
      deliveryType: deliveryType || "delivery",
      paymentMethod: paymentMethod || "cash",
      specialInstructions: specialInstructions || "",
      extras: Array.isArray(extras) ? extras : [],
      extrasTotal: Number(extrasTotal) || 0,
    });

    await order.save();
    await order.populate("items.menuItem");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while creating order" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.menuItem")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching orders" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("items.menuItem");
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Get order error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching order" });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.status !== "pending" && order.status !== "confirmed") {
      return res
        .status(400)
        .json({ success: false, message: "Cannot cancel order at this stage" });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while cancelling order" });
  }
};

// Admin controllers
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.menuItem")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error("Get all orders error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching orders" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while updating order" });
  }
};
