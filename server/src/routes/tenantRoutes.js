const express = require("express");
const router = express.Router();
const { createOrUpdateTenant, getAllTenants } = require("../controllers/tenantController");

// Routes
router.post("/", createOrUpdateTenant);
router.get("/", getAllTenants);

module.exports = router;
