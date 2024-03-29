const cloudinary = require("cloudinary");
const fs = require("fs");
const router = require("express").Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/upload", async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ msg: "No Files are Selected." });
    }
    const file = req.files.file;
    if (file.size > 1024 * 1024) {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "File size is to Large." });
    }
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "File Format is Incorrect." });
    }
    await cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { upload_present: "online-shop", folder: "online-shop" },
      async (err, result) => {
        if (err) throw err;
        removeTmp(file.tempFilePath);
        res.json({ public_id: result.public_id, url: result.secure_url });
      }
    );
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}),
  router.post("/destroy", async (req, res) => {
    try {
      const { public_id } = req.body;
      if (!public_id) {
        return res.status(400).json({ msg: "No image is selected." });
      }
      await cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
        if (err) throw err;
        res.json({ msg: "Image Deleted." });
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  });

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = router;
