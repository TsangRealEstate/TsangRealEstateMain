const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { ScrapeListModel } = require("../models/scrapeList");
const PropertyVideo = require("../models/PropertyVideo");
const cloudinary = require("../config/cloudinary");
const fs = require("fs")
const multer = require("multer");
;

router.post(
  "/:propertyId/video",
  (req, res, next) => {
    upload.single("video")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ error: "Video exceeds 100MB size limit" });
        }
        return res.status(500).json({ error: "Multer error: " + err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    const { propertyId } = req.params;
    const { videounitid } = req.body;

    try {
      const property = await ScrapeListModel.findById(propertyId);
      if (!property)
        return res.status(404).json({ error: "Property not found" });

      const parsedUnitId = parseInt(videounitid, 10);
      if (isNaN(parsedUnitId)) {
        return res.status(400).json({ error: "Invalid videounitid" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No video file uploaded" });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "video",
        folder: "property_videos",
      });

      // Delete local file after upload
      fs.unlinkSync(req.file.path);

      const newVideo = {
        videounitid: parsedUnitId,
        cloudinary_url: result.secure_url,
        cloudinary_id: result.public_id,
      };

      let propertyVideoDoc = await PropertyVideo.findOne({ propertyId });

      if (propertyVideoDoc) {
        propertyVideoDoc.videos.push(newVideo);
        await propertyVideoDoc.save();
      } else {
        propertyVideoDoc = await PropertyVideo.create({
          propertyId,
          videos: [newVideo],
        });
      }

      res.json({
        message: "Video uploaded and saved",
        video: propertyVideoDoc,
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

router.get("/:propertyId/videos", async (req, res) => {
  const { propertyId } = req.params;

  try {
    const property = await ScrapeListModel.findById(propertyId);
    if (!property) return res.status(404).json({ error: "Property not found" });

    // Find the PropertyVideo document
    const propertyVideos = await PropertyVideo.findOne({ propertyId });

    if (!propertyVideos) {
      return res
        .status(404)
        .json({ message: "No videos found for this property" });
    }

    res.json({ videos: propertyVideos.videos });
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
