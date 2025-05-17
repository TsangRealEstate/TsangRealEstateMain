const express = require("express");
const router = express.Router();
const savedUnitController = require("../controllers/savedUnitController");

// Save selected units
router.post("/", savedUnitController.saveSelectedUnits);

// Get saved units by tenant
router.get("/:tenantId", savedUnitController.getSavedUnitsByTenant);

module.exports = router;
