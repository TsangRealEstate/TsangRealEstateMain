const express = require("express");
const router = express.Router();
const {
  createOrUpdateTenant,
  updateTenant,
  getAllTenants,
} = require("../controllers/tenantController");

// Routes
router.post("/", createOrUpdateTenant);
router.get("/", getAllTenants);
router.put("/:id", updateTenant);

module.exports = router;
