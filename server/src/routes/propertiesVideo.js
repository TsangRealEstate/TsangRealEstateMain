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
        if (!property) return res.status(404).json({ error: "Property not found" });

        const parsedUnitId = parseInt(videounitid, 10);
        if (isNaN(parsedUnitId)) {
            return res.status(400).json({ error: "Invalid videounitid" });
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
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;
