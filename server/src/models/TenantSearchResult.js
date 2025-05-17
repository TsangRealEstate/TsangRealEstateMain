const mongoose = require("mongoose");

const tenantSearchResultSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
  },
  tenantName: { type: String, required: true },
  count: { type: Number, required: true },
  listings: { type: Array, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TenantSearchResult", tenantSearchResultSchema);
