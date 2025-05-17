const express = require("express");
const router = express.Router();
const {
  createOrUpdateTenant,
  updateTenant,
  getAllTenants,
  deleteTenant,
  saveSearchResults,
  getSearchResultsByTenantName,
} = require("../controllers/tenantController");

// Routes
router.post("/", createOrUpdateTenant);
router.get("/", getAllTenants);
router.put("/:id", updateTenant);
router.delete("/:id", deleteTenant);
router.post("/search-results", saveSearchResults);
router.get("/search-results/:tenantName", getSearchResultsByTenantName);
module.exports = router;
