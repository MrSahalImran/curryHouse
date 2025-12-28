const cloudinary = require("../utils/cloudinary");

/**
 * Controller to handle image uploads (expects multer to have populated req.file)
 */
async function uploadImage(req, res) {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });

    // Convert buffer to base64 data URI
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
}

module.exports = { uploadImage };
