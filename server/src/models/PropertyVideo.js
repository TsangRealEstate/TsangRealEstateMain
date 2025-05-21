const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  videounitid: Number,
  cloudinary_url: String,
  cloudinary_id: String,
});

const propertyVideoSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ScrapeListModel",
    required: true,
  },
  videos: [videoSchema],
});

module.exports = mongoose.model("PropertyVideo", propertyVideoSchema);
