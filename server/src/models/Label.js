const mongoose = require("mongoose");

const labelSchema = new mongoose.Schema({
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Tenant",
  },
  labels: [
    {
      id: { type: String },
      text: { type: String },
      customColor: { type: String },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Label = mongoose.model("Label", labelSchema);

module.exports = Label;
