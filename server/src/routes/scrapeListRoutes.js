const express = require("express");
const router = express.Router();
const { ScrapeListModel } = require("../models/scrapeList");

// POST endpoint to add new URLs
router.post("/", async (req, res) => {
  try {
    const { title, destinationURL } = req.body;

    // Validate required fields
    if (!destinationURL) {
      return res.status(400).json({
        error: "Validation Error",
        message: "destinationURL is required",
      });
    }

    // Check if URL already exists
    const existingEntry = await ScrapeListModel.findOne({ destinationURL });
    if (existingEntry) {
      return res.status(409).json({
        error: "Conflict",
        message: "Destination URL already exists",
        existingId: existingEntry._id,
        createdAt: existingEntry.createdAt,
      });
    }

    // Create new entry
    const newEntry = await ScrapeListModel.create({
      title: title || `Scrape - ${new Date().toLocaleDateString()}`,
      destinationURL,
      lastScrapeInfo: "none",
    });

    res.status(201).json({
      message: "URL added successfully",
      data: {
        id: newEntry._id,
        title: newEntry.title,
        destinationURL: newEntry.destinationURL,
        status: newEntry.lastScrapeInfo,
        createdAt: newEntry.createdAt,
      },
    });
  } catch (error) {
    console.error("Error adding URL:", error);

    // Handle specific MongoDB errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        message: error.message,
        details: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      error: "Server Error",
      message: "Failed to add URL",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// GET endpoint to list all URLs
router.get("/", async (req, res) => {
  try {
    const entries = await ScrapeListModel.find({})
      .sort({ createdAt: -1 })
      .lean();

    const simplifiedEntries = entries.map((entry) => ({
      _id: entry._id,
      destinationURL: entry.destinationURL,
      lastScrapeInfo: entry.lastScrapeInfo,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      rental_type: entry.Information?.rental_type || null,
      available_units: entry.Information?.available_units || null,
    }));

    res.json({
      count: simplifiedEntries.length,
      data: simplifiedEntries,
    });
  } catch (error) {
    console.error("Error fetching scrape list:", error);
    res.status(500).json({
      error: "Failed to fetch URLs",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
