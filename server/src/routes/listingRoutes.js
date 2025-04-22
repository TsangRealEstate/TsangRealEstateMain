const express = require("express");
const router = express.Router();
const {
  getAllListings,
  scrapeListingDetailsById,
} = require("../controllers/listingController");

router.get("/", getAllListings);
router.get("/scrape/:id", scrapeListingDetailsById);

module.exports = router;
