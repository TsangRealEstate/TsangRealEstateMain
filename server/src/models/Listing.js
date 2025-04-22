const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  name: String,
  address: String,
  price: String,
  image: String,
  scrapedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Listing", listingSchema);
