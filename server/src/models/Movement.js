const mongoose = require("mongoose");

const movementSchema = new mongoose.Schema({
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Tenant",
  },
  fromColumn: {
    type: String,
    required: true,
  },
  toColumn: {
    type: String,
    required: true,
  },
  movedAt: {
    type: Date,
    default: Date.now,
  },
});

const Movement = mongoose.model("Movement", movementSchema);

module.exports = Movement;
