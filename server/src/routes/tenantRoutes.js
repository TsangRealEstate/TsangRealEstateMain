const express = require("express");
const router = express.Router();
const Tenant = require("../models/Tenant");

// POST Endpoint - Create or Update Tenant
router.post("/", async (req, res) => {
  try {
    const tenantData = req.body;
    const { email } = tenantData;

    if (!email) {
      return res.status(400).json({ error: "❌ Email is required." });
    }

    // Check if a tenant with this email already exists
    const existingTenant = await Tenant.findOne({ email });

    if (existingTenant) {
      const updatedTenant = await Tenant.findOneAndUpdate(
        { email },
        { $set: tenantData },
        { new: true, runValidators: true }
      );
      return res.status(200).json({
        message: "Tenant updated successfully!",
        tenant: updatedTenant,
      });
    } else {
      const newTenant = new Tenant(tenantData);
      const savedTenant = await newTenant.save();
      return res.status(201).json({
        message: "Tenant created successfully!",
        tenant: savedTenant,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET Endpoint - Fetch All Tenants (Admin Only)
router.get("/", async (req, res) => {
  try {
    const adminPassword = req.headers["admin-secret"] || req.body.adminSecret;

    if (adminPassword !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        message: "Access denied. Invalid admin credentials.",
      });
    }

    const tenants = await Tenant.find();
    res.status(200).json({
      message: "Tenants fetched successfully!",
      tenants,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
