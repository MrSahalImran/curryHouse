const express = require("express");
const multer = require("multer");
const path = require("path");
const cloudinary = require("../utils/cloudinary");
const router = express.Router();

// Use memory storage and upload to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /api/uploads - accepts a single file in field 'image'
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });

    // Convert buffer to data URI
    const dataUri = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "curryhouse",
      resource_type: "image",
    });

    return res.json({
      success: true,
      data: { url: result.secure_url, public_id: result.public_id },
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ success: false, message: "Upload failed" });
  }
});

module.exports = router;
