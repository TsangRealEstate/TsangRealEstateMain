const express = require("express");
const {
  logMovement,
  getMovementsByCardId,
  getLatestCardPositions,
} = require("../controllers/movementController");
const router = express.Router();

router.post("/", logMovement);
router.get("/:cardId", getMovementsByCardId);
router.get("/positions/latest", getLatestCardPositions);

module.exports = router;
