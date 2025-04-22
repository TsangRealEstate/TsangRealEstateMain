const Listing = require("../models/Listing");

const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    console.error("Failed to fetch listings:", error.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

module.exports = {
  getAllListings,
};
