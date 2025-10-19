const mongoose = require("mongoose");
const dotenv = require("dotenv");
const MenuItem = require("../models/MenuItem");

dotenv.config();

const menuItems = [
  // Biryani
  {
    name: "Jodhpuri Chicken Biryani",
    description: "Rice cooked with boneless chicken, cashews, raisin",
    price: 219,
    category: "Biryani",
    tags: ["Dinner", "Chef Special", "Party"],
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
    isPopular: true,
    spiceLevel: "Medium",
    preparationTime: 25,
  },
  {
    name: "Lamb Biryani",
    description:
      "Fragrant basmati rice with tender lamb pieces and aromatic spices",
    price: 249,
    category: "Biryani",
    tags: ["Dinner", "Party"],
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
    isPopular: true,
    spiceLevel: "Hot",
    preparationTime: 30,
  },
  {
    name: "Vegetable Biryani",
    description: "Mixed vegetables cooked with basmati rice and Indian spices",
    price: 179,
    category: "Biryani",
    tags: ["Vegetarian", "Lunch", "Dinner"],
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
    isVegetarian: true,
    spiceLevel: "Mild",
    preparationTime: 20,
  },

  // Kebabs
  {
    name: "Kylling Kebab i pita",
    description: "Chicken Kebab in pita bread with fresh vegetables and sauce",
    price: 105,
    category: "Kebab",
    tags: ["Lunch", "Dinner"],
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400",
    isPopular: true,
    spiceLevel: "Mild",
    preparationTime: 15,
  },
  {
    name: "Lamb Kebab",
    description: "Grilled lamb kebab with fresh salad and yogurt sauce",
    price: 125,
    category: "Kebab",
    tags: ["Lunch", "Dinner"],
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400",
    spiceLevel: "Medium",
    preparationTime: 20,
  },

  // Drinks
  {
    name: "Cola 0.5L",
    description: "Refreshing cola drink",
    price: 35,
    category: "Drinks",
    tags: ["Lunch", "Dinner"],
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400",
    preparationTime: 2,
  },
  {
    name: "Sprite 0.5L",
    description: "Lemon-lime flavored soft drink",
    price: 35,
    category: "Drinks",
    tags: ["Lunch", "Dinner"],
    image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400",
    preparationTime: 2,
  },
  {
    name: "Fanta 0.5L",
    description: "Orange flavored soft drink",
    price: 35,
    category: "Drinks",
    tags: ["Lunch", "Dinner"],
    image: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=400",
    preparationTime: 2,
  },
  {
    name: "Mango Lassi",
    description: "Traditional Indian yogurt drink with mango",
    price: 45,
    category: "Drinks",
    tags: ["Lunch", "Dinner"],
    image: "https://images.unsplash.com/photo-1578775887804-699de7086ff9?w=400",
    isPopular: true,
    preparationTime: 5,
  },

  // Naan
  {
    name: "Peshawari Naan",
    description: "Leavened bread filled with coconut, raisins and cashews",
    price: 49,
    category: "Naan",
    tags: ["Lunch", "Dinner"],
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
    isPopular: true,
    preparationTime: 10,
  },
  {
    name: "Plain Naan",
    description: "Traditional Indian leavened bread",
    price: 29,
    category: "Naan",
    tags: ["Lunch", "Dinner"],
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
    preparationTime: 8,
  },
  {
    name: "Garlic Naan",
    description: "Naan bread topped with fresh garlic and butter",
    price: 39,
    category: "Naan",
    tags: ["Lunch", "Dinner"],
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
    isPopular: true,
    preparationTime: 10,
  },
  {
    name: "Cheese Naan",
    description: "Naan stuffed with mozzarella cheese",
    price: 49,
    category: "Naan",
    tags: ["Lunch", "Dinner"],
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
    preparationTime: 12,
  },

  // Curry
  {
    name: "Tikka Chicken Masala",
    description: "Grilled chicken in creamy tomato sauce with aromatic spices",
    price: 189,
    category: "Curry",
    tags: ["Dinner", "Chef Special"],
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400",
    isPopular: true,
    spiceLevel: "Medium",
    preparationTime: 25,
  },
  {
    name: "Lamb Tikka Masala",
    description: "Tender lamb pieces in rich masala sauce",
    price: 209,
    category: "Curry",
    tags: ["Dinner", "Party"],
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400",
    spiceLevel: "Hot",
    preparationTime: 30,
  },
  {
    name: "Palak Paneer",
    description: "Indian cottage cheese in creamy spinach curry",
    price: 169,
    category: "Curry",
    tags: ["Vegetarian", "Dinner"],
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
    isVegetarian: true,
    spiceLevel: "Mild",
    preparationTime: 20,
  },
  {
    name: "Butter Chicken",
    description: "Tender chicken in creamy tomato butter sauce",
    price: 199,
    category: "Curry",
    tags: ["Dinner", "Chef Special"],
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400",
    isPopular: true,
    spiceLevel: "Mild",
    preparationTime: 25,
  },

  // Combo Meals
  {
    name: "Tikka Chicken Masala Combo",
    description:
      "Tikka Chicken masala + Plain Naan + One Drink (Mango Lassi/Cold Drink)",
    price: 275,
    category: "Combo Meals",
    tags: ["Lunch", "Dinner", "Chef Special"],
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
    isPopular: true,
    spiceLevel: "Medium",
    preparationTime: 25,
  },
  {
    name: "Lamb Tikka Masala Combo",
    description:
      "Lamb Tikka masala + Plain Naan + One Drink (Mango Lassi/Cold Drink)",
    price: 290,
    category: "Combo Meals",
    tags: ["Lunch", "Dinner", "Party"],
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
    spiceLevel: "Hot",
    preparationTime: 30,
  },

  // Appetizers
  {
    name: "Samosa (2 pieces)",
    description: "Crispy pastry filled with spiced potatoes and peas",
    price: 59,
    category: "Appetizers",
    tags: ["Vegetarian", "Lunch"],
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
    isVegetarian: true,
    spiceLevel: "Mild",
    preparationTime: 15,
  },
  {
    name: "Onion Bhaji",
    description: "Crispy onion fritters with Indian spices",
    price: 65,
    category: "Appetizers",
    tags: ["Vegetarian", "Lunch"],
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
    isVegetarian: true,
    spiceLevel: "Medium",
    preparationTime: 12,
  },
  {
    name: "Chicken Pakora",
    description: "Spiced chicken fritters",
    price: 89,
    category: "Appetizers",
    tags: ["Lunch"],
    image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400",
    spiceLevel: "Medium",
    preparationTime: 15,
  },

  // Desserts
  {
    name: "Gulab Jamun (2 pieces)",
    description: "Sweet milk dumplings in sugar syrup",
    price: 55,
    category: "Desserts",
    tags: ["Dinner"],
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400",
    isPopular: true,
    preparationTime: 5,
  },
  {
    name: "Kulfi (Mango)",
    description: "Traditional Indian ice cream with mango flavor",
    price: 49,
    category: "Desserts",
    tags: ["Dinner"],
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400",
    preparationTime: 5,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log("🗑️  Cleared existing menu items");

    // Insert new menu items
    const insertedItems = await MenuItem.insertMany(menuItems);
    console.log(`✅ Inserted ${insertedItems.length} menu items`);

    console.log("\n🎉 Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
