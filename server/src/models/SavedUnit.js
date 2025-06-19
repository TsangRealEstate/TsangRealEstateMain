const mongoose = require("mongoose");

const savedUnitSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
  },
  tenantName: {
    type: String,
    required: true,
  },
  selectedUnits: [
    {
      unitId: String,
      propertyId: String,
      propertyArea: String,
      propertyName: String,
      unitName: String,
      price: Number,
      sqft: Number,
      videoId: Number,
      availableDate: String,
      bed: Number,
      bath: Number,
      isFavorite: {  
        type: Boolean,
        default: false
      },
      scrapeListId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ScrapeList",
        required: true,
      },
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SavedUnit", savedUnitSchema);
