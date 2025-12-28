const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const cloudinary = require("../utils/cloudinary");

async function main() {
  const filePath = process.argv[2] || path.join(process.cwd(), "wp.jpg");
  if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath);
    console.error("Usage: node scripts/upload-test.js C:\\path\\to\\file.jpg");
    process.exit(1);
  }

  console.log("Using Cloudinary config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "set" : "MISSING",
    api_key: process.env.CLOUDINARY_API_KEY ? "set" : "MISSING",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "set" : "MISSING",
  });

  try {
    const res = await cloudinary.uploader.upload(filePath, {
      folder: "curryhouse",
    });
    console.log("Upload success:", {
      url: res.secure_url,
      public_id: res.public_id,
    });
  } catch (err) {
    console.error("Upload error:", err && err.message ? err.message : err);
    if (err && err.http_code) console.error("http_code:", err.http_code);
    process.exit(1);
  }
}

main();
