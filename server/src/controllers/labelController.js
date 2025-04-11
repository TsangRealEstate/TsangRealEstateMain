const { Label, CardLabel } = require("../models/Label");

// Get all available labels
const getAllLabels = async (req, res) => {
  try {
    const labels = await Label.find();
    res.status(200).json(labels);
  } catch (error) {
    console.error("Error fetching labels:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new standard label
const createLabel = async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).json({ message: "Name and color are required" });
    }

    const existingLabel = await Label.findOne({ name });
    if (existingLabel) {
      return res
        .status(400)
        .json({ message: "Label with this name already exists" });
    }

    const newLabel = new Label({ name, color });
    await newLabel.save();

    res.status(201).json(newLabel);
  } catch (error) {
    console.error("Error creating label:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get labels for a specific card
const getLabelsByCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    const cardLabels = await CardLabel.find({ cardId }).populate("labelId");

    res.status(200).json(cardLabels);
  } catch (error) {
    console.error("Error fetching card labels:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update label assignments for a card
const updateCardLabels = async (req, res) => {
  try {
    const { cardId, labelId, isActive, customName } = req.body;

    if (!cardId || !labelId) {
      return res
        .status(400)
        .json({ message: "cardId and labelId are required" });
    }

    const update = await CardLabel.findOneAndUpdate(
      { cardId, labelId },
      { isActive, customName },
      { new: true, upsert: true }
    ).populate("labelId");

    res.status(200).json(update);
  } catch (error) {
    console.error("Error updating card labels:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a label
const deleteLabel = async (req, res) => {
  try {
    const { labelId } = req.params;

    // First delete all card associations
    await CardLabel.deleteMany({ labelId });

    // Then delete the label itself
    const deletedLabel = await Label.findByIdAndDelete(labelId);

    if (!deletedLabel) {
      return res.status(404).json({ message: "Label not found" });
    }

    res.status(200).json({ message: "Label deleted successfully" });
  } catch (error) {
    console.error("Error deleting label:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all card-label relationships with populated label data
const getAllCardLabels = async (req, res) => {
  try {
    const cardLabels = await CardLabel.find().populate("labelId").lean(); // Convert to plain JS object

    // Transform the data into a more efficient structure
    const labelsByCard = cardLabels.reduce(
      (acc, { cardId, labelId, isActive, customName }) => {
        if (!acc[cardId]) {
          acc[cardId] = [];
        }
        if (labelId && isActive) {
          // Only include active labels
          acc[cardId].push({
            _id: labelId._id,
            name: customName || labelId.name,
            color: labelId.color,
            isPredefined: labelId.isPredefined,
          });
        }
        return acc;
      },
      {}
    );

    res.status(200).json(labelsByCard);
  } catch (error) {
    console.error("Error fetching all card labels:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllLabels,
  createLabel,
  getLabelsByCard,
  updateCardLabels,
  deleteLabel,
  getAllCardLabels,
};
