const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Disk storage for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || ".jpg";
    const base = file.fieldname + "-" + Date.now();
    cb(null, base + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /api/uploads - accepts a single file in field 'image'
router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    const url = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    return res.json({
      success: true,
      data: { url, filename: req.file.filename },
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ success: false, message: "Upload failed" });
  }
});

module.exports = router;
