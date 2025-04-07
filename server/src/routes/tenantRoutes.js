const express = require("express");
const router = express.Router();
const {
  createOrUpdateTenant,
  updateTenant,
  getAllTenants,
  deleteTenant,
} = require("../controllers/tenantController");

// Routes
router.post("/", createOrUpdateTenant);
router.get("/", getAllTenants);
router.put("/:id", updateTenant);
router.delete("/:id", deleteTenant);
module.exports = router;
