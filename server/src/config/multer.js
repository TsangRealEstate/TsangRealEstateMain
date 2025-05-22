const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "property_videos",
    resource_type: "video",
    format: "mp4",
  },
});

const upload = multer({ storage });

module.exports = upload;
