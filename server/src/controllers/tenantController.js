const Tenant = require("../models/Tenant");
const { sendMeetingInvite } = require("./meetingController");
const TenantSearchResult = require("../models/TenantSearchResult");

// ✅ Create a Tenant
const createOrUpdateTenant = async (req, res) => {
  try {
    const tenantData = req.body;
    const { email } = tenantData;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    let tenant;
    let message;

    tenant = new Tenant(tenantData);
    await tenant.save();
    message = "Tenant created successfully!";

    const inviteResult = await sendMeetingInvite(tenant._id);
    return res.status(tenant.isNew ? 201 : 200).json({
      message: `${message} Meeting invite ${
        inviteResult.success ? "sent!" : "failed!"
      }`,
      inviteResult,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Fetch All Tenants (Admin Only)
const getAllTenants = async (req, res) => {
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
};

// ✅ Update Tenant (by ID)
const updateTenant = async (req, res) => {
  try {
    const tenantId = req.params.id;
    const updateData = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: "Tenant ID is required." });
    }

    const updatedTenant = await Tenant.findByIdAndUpdate(
      tenantId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedTenant) {
      return res.status(404).json({ error: "Tenant not found." });
    }

    res.status(200).json({
      message: "Tenant updated successfully!",
      tenant: updatedTenant,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete Tenant (by ID)
const deleteTenant = async (req, res) => {
  try {
    const tenantId = req.params.id;

    if (!tenantId) {
      return res.status(400).json({ error: "Tenant ID is required." });
    }

    const deletedTenant = await Tenant.findByIdAndDelete(tenantId);

    if (!deletedTenant) {
      return res.status(404).json({ error: "Tenant not found." });
    }

    res.status(200).json({ message: "Tenant deleted successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const saveSearchResults = async (req, res) => {
  try {
    const { tenantId, tenantName, count, listings } = req.body;

    // Check if results already exist for this tenant
    const existingResult = await TenantSearchResult.findOne({ tenantId });

    let result;
    if (existingResult) {
      // Update existing record
      existingResult.count = count;
      existingResult.listings = listings;
      result = await existingResult.save();
    } else {
      // Create new record
      result = await TenantSearchResult.create({
        tenantId,
        tenantName,
        count,
        listings,
      });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSearchResultsByTenantName = async (req, res) => {
  try {
    const { tenantName } = req.params;

    const result = await TenantSearchResult.findOne({ tenantName })
      .sort({ timestamp: -1 })
      .exec();

    if (!result) {
      return res
        .status(404)
        .json({ message: "No results found for this tenant" });
    }

    res.status(200).json({
      count: result.count,
      listings: result.listings,
      tenantId: result.tenantId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrUpdateTenant,
  getAllTenants,
  updateTenant,
  deleteTenant,
  saveSearchResults,
  getSearchResultsByTenantName,
};
