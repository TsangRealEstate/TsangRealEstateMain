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
        message: "Property URL already exists",
        existingId: existingEntry._id,
        createdAt: existingEntry.createdAt,
      });
    }

    // Create new entry
    const newEntry = await ScrapeListModel.create({
      title: title || `San Antonio Apartments`,
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

    // Build the initial filter for top-level properties
    const propertyFilter = {};

    // Area filter
    if (area) {
      const areas = area.split("&").map((a) => a.trim());
      propertyFilter["Information.neighborhood"] = { $in: areas };
    }

    // Amenities filters
    if (inUnitLaundry) {
      propertyFilter["Information.unit_amenities.display_name"] =
        "In unit laundry";
    }
    if (balcony) {
      propertyFilter["Information.unit_amenities.display_name"] = "Balcony";
    }
    if (yard) {
      propertyFilter["Information.unit_amenities.display_name"] = "Yard";
    }

    // Build the aggregation pipeline
    const pipeline = [
      { $match: propertyFilter },
      { $unwind: "$Information.available_units" },
    ];

    // Add unit-level filters
    const unitMatch = {};

    // Bedrooms filter
    if (beds) {
      unitMatch["Information.available_units.bed"] = Number(beds);
    }

    // Bathrooms filter
    if (baths) {
      unitMatch["Information.available_units.bath"] = Number(baths);
    }

    // Price range filter
    if (minPrice || maxPrice) {
      unitMatch["Information.available_units.price"] = {};
      if (minPrice)
        unitMatch["Information.available_units.price"].$gte = Number(minPrice);
      if (maxPrice)
        unitMatch["Information.available_units.price"].$lte = Number(maxPrice);
    }

    if (Object.keys(unitMatch).length > 0) {
      pipeline.push({ $match: unitMatch });
    }

    // Handle nested units filtering
    if (earliestMoveInDate || latestMoveInDate) {
      pipeline.push({
        $addFields: {
          "Information.available_units.units": {
            $filter: {
              input: "$Information.available_units.units",
              as: "specificUnit",
              cond: {
                $and: [
                  { $ifNull: ["$$specificUnit.available_on", false] },
                  earliestMoveInDate
                    ? {
                      $gte: [
                        "$$specificUnit.available_on",
                        earliestMoveInDate,
                      ],
                    }
                    : true,
                  latestMoveInDate
                    ? {
                      $lte: ["$$specificUnit.available_on", latestMoveInDate],
                    }
                    : true,
                ].filter((cond) => cond !== true),
              },
            },
          },
        },
      });
    }

    // Filter out units with empty units array
    pipeline.push({
      $match: {
        "Information.available_units.units.0": { $exists: true },
      },
    });

    // Group back the results
    pipeline.push({
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        destinationURL: { $first: "$destinationURL" },
        Information: { $first: "$Information" },
        available_units: { $push: "$Information.available_units" },
      },
    });

    // Final projection
    pipeline.push({
      $project: {
        _id: 1,
        title: 1,
        destinationURL: 1,
        Information: {
          specials: "$Information.specials",
          prices: "$Information.prices",
          display_name: "$Information.display_name",
          street_address: "$Information.street_address",
          neighborhood: "$Information.neighborhood",
          city: "$Information.city",
          state: "$Information.state",
          zip: "$Information.zip",
          description: "$Information.description",
          first_photo: "$Information.first_photo",
          available_units: "$available_units",
        },
      },
    });

    // Filter out properties with no available units
    pipeline.push({
      $match: {
        "Information.available_units.0": { $exists: true },
      },
    });

    const properties = await ScrapeListModel.aggregate(pipeline);

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

//Getting all the properties from the database
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

// Update property specials endpoint
router.put("/:id/specials", async (req, res) => {
  try {
    const { id } = req.params;
    const { specials } = req.body;

    // Validate input
    if (!Array.isArray(specials)) {
      return res.status(400).json({
        error: "Invalid input",
        message: "Specials must be an array",
      });
    }

    const updatedProperty = await ScrapeListModel.findByIdAndUpdate(
      id,
      { "Information.specials": specials },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProperty) {
      return res.status(404).json({
        error: "Property not found",
        message: `No property found with ID: ${id}`,
      });
    }

    res.json({
      success: true,
      data: updatedProperty.Information.specials,
    });
  } catch (error) {
    console.error(
      `Error updating specials for property ${req.params.id}:`,
      error
    );
    res.status(500).json({
      error: "Failed to update specials",
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

// DELETE endpoint to remove a property by URL (encoded)
router.delete("/url/:encodedUrl", async (req, res) => {
  try {
    const { encodedUrl } = req.params;
    const destinationURL = decodeURIComponent(encodedUrl);

    // Validate URL format
    try {
      new URL(
        destinationURL.startsWith("http")
          ? destinationURL
          : `https://${destinationURL}`
      );
    } catch (err) {
      return res.status(400).json({
        error: "Invalid URL",
        message: "Please provide a valid URL",
      });
    }

    const deletedProperty = await ScrapeListModel.findOneAndDelete({
      destinationURL: { $regex: destinationURL, $options: "i" },
    });

    if (!deletedProperty) {
      return res.status(404).json({
        error: "Not Found",
        message: `No property found with URL: ${destinationURL}`,
      });
    }

    res.json({
      success: true,
      message: `${deletedProperty?.Information?.display_name ||
        deletedProperty?.destinationURL ||
        "Property"
        } deleted successfully`,
    });
  } catch (error) {
    console.error(`Error deleting property by URL:`, error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to delete property",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
