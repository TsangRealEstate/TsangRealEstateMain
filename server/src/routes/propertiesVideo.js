const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { ScrapeListModel } = require("../models/scrapeList");
const PropertyVideo = require("../models/PropertyVideo");

router.post("/:propertyId/video", upload.single("video"), async (req, res) => {
  const { propertyId } = req.params;
  const { videounitid } = req.body;

  try {
    const property = await ScrapeListModel.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const parsedUnitId = parseInt(videounitid, 10);
    if (isNaN(parsedUnitId)) {
      return res.status(400).json({ error: "Invalid videounitid" });
    }

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No video file uploaded" });
    }

    // Validate file size (limit to 100MB)
    const MAX_SIZE_MB = 100;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    if (req.file.size > MAX_SIZE_BYTES) {
      return res.status(400).json({
        error: `Video file exceeds the ${MAX_SIZE_MB}MB limit allowed on the Free plan. Please upload a smaller file.`,
      });
    }

    const newVideo = {
      videounitid: parsedUnitId,
      cloudinary_url: req.file.path,
      cloudinary_id: req.file.filename,
    };

    // Check if PropertyVideo already exists
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

    res.json({ message: "Video uploaded and saved", video: propertyVideoDoc });
  } catch (err) {
    console.error("Upload error:", err);

    if (err instanceof Error) {
      console.error("Message:", err.message);
      console.error("Stack:", err.stack);
    } else {
      console.error(
        "Raw error (non-Error object):",
        JSON.stringify(err, null, 2)
      );
    }

    res.status(500).json({ error: "Something went wrong" });
  }
});

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
