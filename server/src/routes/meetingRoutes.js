const express = require("express");
const router = express.Router();
const {
  sendMeetingInvite,
  sendUnitsToTenant,
} = require("../controllers/meetingController");

router.post("/send-invite/:id", async (req, res) => {
  try {
    const result = await sendMeetingInvite(req.params.id);
    if (result.success) {
      return res.status(200).json({
        message: "✅ Meeting invite sent successfully!",
        invite_link: result.invite_link,
      });
    } else {
      return res.status(500).json({
        error: "❌ Failed to send meeting invite.",
        details: result.error,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "❌ Internal server error." });
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
module.exports = router;
