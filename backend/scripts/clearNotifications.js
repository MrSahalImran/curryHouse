const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

async function run() {
  const mongo =
    process.env.MONGO_URI ||
    process.env.DATABASE_URL ||
    "mongodb://localhost:27017/curryhouse";
  console.log("Connecting to", mongo);
  await mongoose.connect(mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected. Removing notifications field from all users...");
  const res = await User.updateMany({}, { $unset: { notifications: "" } });
  console.log("Update result:", res.nModified || res.modifiedCount || res);
  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
