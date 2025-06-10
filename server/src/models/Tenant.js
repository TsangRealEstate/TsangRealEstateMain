const mongoose = require("mongoose");

const normalizeBudget = (budget) => {
  return budget
    .replace(/below\s*/i, "")
    .replace(/\$(\d+)k(\+?)/g, (match, amount, plusSign) => {
      return plusSign ? `$${amount}000` : `$${amount}000`;
    })
    .replace(/\+\s*$/, "");
};

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

    OtherOnLease: { type: String, enum: ["yes", "no"], required: false },

    othersOnLeasevalue: { type: String, required: false },

    bathrooms: { type: String, required: true },

    bedrooms: { type: String, required: true },

    brokenLease: { type: [String], default: [] },

    budget: {
      type: String,
      required: true,
      set: function (val) {
        const trimmed = val.trim();
        let normalized = trimmed;
        if (
          trimmed.toLowerCase().includes("k") ||
          trimmed.includes("+") ||
          trimmed.toLowerCase().includes("below")
        ) {
          normalized = normalizeBudget(trimmed);
        }

        return normalized.includes("-") ? normalized : `$0 - ${normalized}`;
      },
    },

    creditScore: { type: String, required: false },

    desiredLocation: { type: [String], default: [] },

    grossIncome: { type: String, required: false },

    instagram: { type: String },

    leaseEndDate: { type: String, required: false },

    leaseStartDate: { type: String, required: false },

    timeForCall: { type: String, required: true },

    AvailabilityDate: { type: String, required: true },

    nonNegotiables: { type: [String], default: [] },

    propertyOwnerName: { type: String, required: false },

    closingTimeline: { type: String, required: false },

    preApproval: { type: String, required: false },

    preApprovalAmount: {
      type: String,
      required: false,
      set: function (val) {
        const trimmed = val.trim();
        let normalized = trimmed;
        if (
          trimmed.toLowerCase().includes("k") ||
          trimmed.includes("+") ||
          trimmed.toLowerCase().includes("below")
        ) {
          normalized = normalizeBudget(trimmed);
        }

        return normalized.includes("-") ? normalized : `$0 - ${normalized}`;
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tenant", tenantSchema);
