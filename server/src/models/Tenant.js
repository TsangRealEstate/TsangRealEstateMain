const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ["ADMIN", "GUEST"],
      default: "GUEST",
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true },
    searchType: { type: String, enum: ["rent", "purchase"], required: true },
    OtherOnLease: { type: String, enum: ["yes", "no"], required: true },
    othersOnLeasevalue: { type: String, required: false },
    bathrooms: { type: String, required: true },
    bedrooms: { type: String, required: true },
    brokenLease: { type: [String], default: [] },
    budget: { type: String, required: true },
    creditScore: { type: String, required: true },
    desiredLocation: { type: [String], default: [] },
    grossIncome: { type: String, required: true },
    instagram: { type: String },
    leaseEndDate: { type: String, required: true },
    leaseStartDate: { type: String, required: true },
    nonNegotiables: { type: [String], default: [] },
    propertyOwnerName: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tenant", tenantSchema);
