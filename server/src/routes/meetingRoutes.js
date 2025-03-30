const express = require("express");
const router = express.Router();
const { sendMeetingInvite } = require("../controllers/meetingController");

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

module.exports = router;
