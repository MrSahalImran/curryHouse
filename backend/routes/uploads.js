const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadImage } = require("../controllers/uploadControllers");
const router = express.Router();

// Use memory storage and upload to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// @route   POST /api/uploads
// @desc    Upload an image (accepts a single file in field 'image') and store it in Cloudinary
// @access  Private
router.post("/", upload.single("image"), uploadImage);

module.exports = router;
