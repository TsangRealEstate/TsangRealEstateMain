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

// GET endpoint to list all URLs with simplified data
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
      neighborhood: entry.Information?.neighborhood || null,
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

// GET endpoint with filtering capabilities
router.get("/filter", async (req, res) => {
  try {
    const {
      area,
      minPrice,
      maxPrice,
      beds,
      baths,
      earliestMoveInDate,
      latestMoveInDate,
      inUnitLaundry,
      balcony,
      yard,
    } = req.query;

    // Build the filter object
    const filter = {};

    // Area filter (assuming 'neighborhood' field in the database)
    if (area) {
      const areas = area.split("&").map((a) => a.trim());
      filter["Information.neighborhood"] = { $in: areas };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter["Information.available_units.price"] = {};
      if (minPrice)
        filter["Information.available_units.price"].$gte = Number(minPrice);
      if (maxPrice)
        filter["Information.available_units.price"].$lte = Number(maxPrice);
    }

    // Bedrooms filter
    if (beds) {
      filter["Information.available_units.bed"] = Number(beds);
    }

    // Bathrooms filter
    if (baths) {
      filter["Information.available_units.bath"] = Number(baths);
    }

    // Move-in date range filter
    if (earliestMoveInDate || latestMoveInDate) {
      filter["Information.available_units.available_on"] = {};
      if (earliestMoveInDate) {
        filter["Information.available_units.available_on"].$gte = new Date(
          earliestMoveInDate
        ).toISOString();
      }
      if (latestMoveInDate) {
        filter["Information.available_units.available_on"].$lte = new Date(
          latestMoveInDate
        ).toISOString();
      }
    }

    // Amenities filters
    if (inUnitLaundry) {
      filter["Information.unit_amenities.display_name"] = "In unit laundry";
    }
    if (balcony) {
      filter["Information.unit_amenities.display_name"] = "Balcony";
    }
    if (yard) {
      filter["Information.unit_amenities.display_name"] = "Yard";
    }

    // Query the database with filters
    const properties = await ScrapeListModel.aggregate([
      { $match: filter },
      {
        $project: {
          _id: 1,
          title: 1,
          destinationURL: 1,
          "Information.display_name": 1,
          "Information.street_address": 1,
          "Information.neighborhood": 1,
          "Information.city": 1,
          "Information.state": 1,
          "Information.zip": 1,
          "Information.description": 1,
          "Information.first_photo": 1,
          "Information.available_units": {
            $filter: {
              input: "$Information.available_units",
              as: "unit",
              cond: {
                $and: [
                  minPrice
                    ? { $gte: ["$$unit.price", Number(minPrice)] }
                    : true,
                  maxPrice
                    ? { $lte: ["$$unit.price", Number(maxPrice)] }
                    : true,
                  beds ? { $eq: ["$$unit.bed", Number(beds)] } : true,
                  baths ? { $eq: ["$$unit.bath", Number(baths)] } : true,
                  earliestMoveInDate
                    ? {
                        $gte: [
                          "$$unit.available_on",
                          new Date(earliestMoveInDate).toISOString(),
                        ],
                      }
                    : true,
                  latestMoveInDate
                    ? {
                        $lte: [
                          "$$unit.available_on",
                          new Date(latestMoveInDate).toISOString(),
                        ],
                      }
                    : true,
                ].filter((cond) => cond !== true),
              },
            },
          },
        },
      },
    ]);

    res.json({
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("Error filtering properties:", error);
    res.status(500).json({
      error: "Failed to filter properties",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

//Getting all the propertys from the database
router.get("/", async (req, res) => {
  try {
    const entries = await ScrapeListModel.find({})
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      count: entries.length,
      data: entries,
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

// Get property by ID endpoint
router.get("/:id", async (req, res) => {
  try {
    const property = await ScrapeListModel.findById(req.params.id).lean();

    if (!property) {
      return res.status(404).json({
        error: "Property not found",
        message: `No property found with ID: ${req.params.id}`,
      });
    }

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error(`Error fetching property ${req.params.id}:`, error);
    res.status(500).json({
      error: "Failed to fetch property",
      details:
        process.env.NODE_ENV === "development"
          ? {
              message: error.message,
              stack: error.stack,
            }
          : undefined,
    });
  }
});

module.exports = router;
