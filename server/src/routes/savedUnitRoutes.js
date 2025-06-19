const express = require("express");
const router = express.Router();
const savedUnitController = require("../controllers/savedUnitController");

router.post("/", savedUnitController.saveSelectedUnits);

router.get("/:tenantId", savedUnitController.getSavedUnitsByTenant);

router.patch('/:tenantId/toggle-favorite/:unitId', savedUnitController.toggleFavoriteUnit);

router.delete("/:tenantId", savedUnitController.deleteSavedUnits);

module.exports = router;
