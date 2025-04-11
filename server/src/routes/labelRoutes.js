const express = require("express");
const router = express.Router();
const {
  getAllLabels,
  createLabel,
  getLabelsByCard,
  getAllCardLabels,
  updateCardLabels,
  deleteLabel,
} = require("../controllers/labelController");

// Get all available labels
router.get("/", getAllLabels);

// Create a new standard label
router.post("/", createLabel);

// Get labels for a specific card
router.get("/card/:cardId", getLabelsByCard);

// Update label assignments for a card
router.post("/card", updateCardLabels);

// Delete a label
router.delete("/:labelId", deleteLabel);
// Get all card labels
router.get("/card-labels/all", getAllCardLabels);

module.exports = router;
