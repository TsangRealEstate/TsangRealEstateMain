const express = require("express");
const router = express.Router();
const Tenant = require("../models/Tenant");
const {
  sendMeetingInvite,
  sendUnitsToTenant,
  sendClientInfoToPropertyOwner,
} = require("../controllers/meetingController");

router.post("/send-invite/:id", async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found." });
    }

    // Check if email is the default value
    if (tenant.email === "default@example.com") {
      return res.status(400).json({
        error: "Cannot send invite - default email detected",
        message:
          "Please edit the tenant's email address before sending an invite",
        requiresEmailUpdate: true,
        tenantId: tenant._id,
      });
    }

    // Proceed with sending invite if email is valid
    const result = await sendMeetingInvite(req.params.id);

    if (result.success) {
      return res.status(200).json({
        message: "Meeting invite sent successfully!",
        invite_link: result.invite_link,
      });
    } else {
      return res.status(500).json({
        error: "Failed to send meeting invite.",
        details: result.error,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error.",
      details: error.message,
    });
  }
});

// Send saved units/property areas to tenant
router.post("/:id/send-units", async (req, res) => {
  try {
    const result = await sendUnitsToTenant(req.params.id);
    if (result.success) {
      res.json({
        message: "Property areas sent successfully",
        areas: result.areas,
        count: result.areas.length,
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

router.post("/send-info/:tenantId", async (req, res) => {
  try {
    const result = await sendClientInfoToPropertyOwner(req.params.tenantId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
module.exports = router;
