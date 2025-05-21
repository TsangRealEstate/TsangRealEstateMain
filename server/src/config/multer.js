const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "property_videos",
    resource_type: "video",
    allowedFormats: ["mp4", "mov", "avi"],
  },
});

const upload = multer({ storage });

module.exports = upload;
