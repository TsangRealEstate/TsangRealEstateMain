const mongoose = require("mongoose");

const labelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  color: {
    type: String,
    required: true,
  },
  isPredefined: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Card-specific label assignments
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

// Create predefined labels if they don't exist
const createPredefinedLabels = async () => {
  const predefinedLabels = [
    { name: "Important", color: "#ef4444", isPredefined: true },
    { name: "Info", color: "#3b82f6", isPredefined: true },
    { name: "Success", color: "#10b981", isPredefined: true },
    { name: "Warning", color: "#f59e0b", isPredefined: true },
  ];

  for (const label of predefinedLabels) {
    await Label.findOneAndUpdate({ name: label.name }, label, {
      upsert: true,
      new: true,
    });
  }
  console.log("Predefined labels initialized");
};

const cleanupLabelCollection = async () => {
  try {
    await Label.collection.dropIndexes();
    console.log("Dropped all indexes from labels collection");
  } catch (err) {
    console.error("Error dropping indexes:", err);
  }
};

module.exports = {
  Label,
  CardLabel,
  createPredefinedLabels,
  cleanupLabelCollection,
};
