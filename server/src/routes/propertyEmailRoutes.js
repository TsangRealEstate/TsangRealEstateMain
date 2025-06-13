const express = require("express");
const router = express.Router();
const propertyEmailController = require("../controllers/propertyEmailController");

router.post("/", propertyEmailController.create);

router.get("/", propertyEmailController.getAll);

router.get( "/scrapeList/:scrapeListId", propertyEmailController.getByScrapeListId);

router.delete("/:id", propertyEmailController.delete);

module.exports = router;
