const Movement = require("../models/Movement");

// Create a new movement log
const logMovement = async (req, res) => {
  try {
    const { cardId, fromColumn, toColumn } = req.body;

    if (!cardId || !fromColumn || !toColumn) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newMovement = new Movement({
      cardId,
      fromColumn,
      toColumn,
    });

    await newMovement.save();

    res.status(201).json({
      message: "Movement logged successfully!",
      movement: newMovement,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch all movements for a card
const getMovementsByCardId = async (req, res) => {
  try {
    const { cardId } = req.params;

    const movements = await Movement.find({ cardId }).sort({ movedAt: -1 }); // latest first

    res.status(200).json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch the latest position of each card
const getLatestCardPositions = async (req, res) => {
  try {
    const latestMovements = await Movement.aggregate([
      {
        $sort: { movedAt: -1 },
      },
      {
        $group: {
          _id: "$cardId",
          latestMovement: { $first: "$$ROOT" },
        },
      },
    ]);
    const cardPositions = {};
    latestMovements.forEach((movement) => {
      cardPositions[movement._id] = movement.latestMovement.toColumn;
    });

    res.status(200).json(cardPositions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { logMovement, getMovementsByCardId, getLatestCardPositions };
