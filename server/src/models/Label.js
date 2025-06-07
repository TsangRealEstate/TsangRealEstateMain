const mongoose = require("mongoose");

// Centralized color definitions (export for frontend if needed)
const PREDEFINED_COLORS = [
  { name: "Red", value: "#ef4444", isPredefined: true },
  { name: "Light Blue", value: "#7dd3fc", isPredefined: true },
  { name: "Light Green", value: "#86efac", isPredefined: true },
  { name: "Grey", value: "#9ca3af", isPredefined: true },
  { name: "Yellow", value: "#fde047", isPredefined: true },
  { name: "Purple", value: "#c084fc", isPredefined: true },
  { name: "Pink", value: "#f9a8d4", isPredefined: true },
  { name: "Orange", value: "#fdba74", isPredefined: true },
  { name: "Indigo", value: "#818cf8", isPredefined: true },
  { name: "Beige", value: "#f5f5dc", isPredefined: true },
];

// In your Label model file
const labelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  color: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return PREDEFINED_COLORS.some((color) => color.value === v);
      },
      message: (props) => `${props.value} is not a valid color!`,
    },
  },
  isPredefined: {
    type: Boolean,
    default: false,
  },
  // Add a reference count to track usage
  usageCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Card-specific label assignments (unchanged)
const cardLabelSchema = new mongoose.Schema({
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Tenant",
  },
  labelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Label",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  customName: {
    type: String,
    default: "",
  },
});

const Label = mongoose.model("Label", labelSchema);
const CardLabel = mongoose.model("CardLabel", cardLabelSchema);

// Initialize with predefined colors
const createPredefinedLabels = async () => {
  for (const color of PREDEFINED_COLORS) {
    await Label.findOneAndUpdate(
      { name: color.name },
      {
        name: color.name,
        color: color.value,
        isPredefined: true,
      },
      { upsert: true }
    );
  }
  console.log("Predefined color labels initialized");
};

module.exports = {
  Label,
  CardLabel,
  createPredefinedLabels,
  PREDEFINED_COLORS, // Export for frontend if needed
  cleanupLabelCollection: async () => {
    try {
      await Label.collection.dropIndexes();
      console.log("Dropped all indexes from labels collection");
    } catch (err) {
      console.error("Error dropping indexes:", err);
    }
  },
};
