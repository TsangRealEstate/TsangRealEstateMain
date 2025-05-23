const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const MAX_SIZE_MB = 100;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const isVideo = file.mimetype.startsWith("video/");
    if (!isVideo) {
      return cb(new Error("Only video files are allowed"));
    }
    cb(null, true);
  },
});

module.exports = upload;
