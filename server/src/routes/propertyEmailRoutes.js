const express = require("express");
const router = express.Router();
const propertyEmailController = require("../controllers/propertyEmailController");

// Create a new property email
router.post("/", propertyEmailController.create);

// Get all property emails
router.get("/", propertyEmailController.getAll);

// Get property emails by scrapeList ID
router.get(
  "/scrapeList/:scrapeListId",
  propertyEmailController.getByScrapeListId
);

// Delete a property email
router.delete("/:id", propertyEmailController.delete);

module.exports = router;
