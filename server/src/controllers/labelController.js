const Label = require("../models/Label");

const saveLabels = async (req, res) => {
  try {
    const { cardId, labels } = req.body;

    if (!cardId) {
      return res.status(400).json({ message: "cardId is required" });
    }

    const labelDoc = await Label.findOneAndUpdate(
      { cardId },
      { labels },
      { new: true, upsert: true }
    );

    res.status(200).json(labelDoc);
  } catch (error) {
    console.error("Error saving labels:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getLabelsByCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    const labelDoc = await Label.findOne({ cardId });

    res.status(200).json(labelDoc || { labels: [] });
  } catch (error) {
    console.error("Error fetching labels:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  saveLabels,
  getLabelsByCard,
};
