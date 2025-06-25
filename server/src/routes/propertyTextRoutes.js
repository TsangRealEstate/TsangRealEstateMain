const express = require("express");
const router = express.Router();
const propertyTextController = require("../controllers/propertyTextController");

router.post("/", propertyTextController.createOrUpdatePropertyText);

router.get("/:scrapeListId", propertyTextController.getPropertyText);

router.put("/:scrapeListId", propertyTextController.updatePropertyText);

module.exports = router;
