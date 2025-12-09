const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Menu item name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/300x200",
    },
    tags: [
      {
        type: String,
        enum: [
          "Party",
          "Lunch",
          "Dinner",
          "Coffee",
          "Breakfast",
          "Vegetarian",
          "Vegan",
          "Spicy",
          "Chef Special",
        ],
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    spiceLevel: {
      type: String,
      enum: ["Mild", "Medium", "Hot", "Extra Hot"],
      default: "Medium",
    },
    preparationTime: {
      type: Number, // in minutes
      default: 20,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
