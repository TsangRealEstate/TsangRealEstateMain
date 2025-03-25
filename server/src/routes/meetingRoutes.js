const express = require("express");
const router = express.Router();
const Tenant = require("../models/Tenant");
const nodemailer = require("nodemailer");
const hbs = require("hbs");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Setup Nodemailer Transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const templatePath = path.join(__dirname, "../../views/meeting-invite.hbs");
hbs.registerPartials(path.join(__dirname, "../../views/partials"));

const renderTemplate = (template, data) => {
  const compiledTemplate = hbs.handlebars.compile(template);
  return compiledTemplate(data);
};

// POST Endpoint - Send Meeting Invite
router.post("/send-invite/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find Tenant by ID
    const tenant = await Tenant.findById(id);
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found." });
    }

    const userEmail = tenant.email;
    const eventSchedulingUrl = process.env.CALENDLY_EVENT_LINK;

    if (!userEmail || !eventSchedulingUrl) {
      return res.status(400).json({
        error: "Missing userEmail or Event Scheduling URL.",
      });
    }

    // Read and Render HBS Template
    const template = await fs.promises.readFile(templatePath, "utf8");
    const html = renderTemplate(template, {
      firstName: tenant.firstName,
      eventSchedulingUrl,
    });

    // Setup Email Options
    const mailOptions = {
      from: `"Agent Team" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "📅 Meeting Invitation - Schedule a Meeting",
      html,
    };

    // Send the Email
    await transporter.sendMail(mailOptions);
    console.log(
      `📧 Email sent to ${userEmail} with link: ${eventSchedulingUrl}`
    );

    res.status(200).json({
      message: "Meeting invite sent successfully via email!",
      invite_link: eventSchedulingUrl,
    });
  } catch (error) {
    console.error(
      "Error sending meeting invite:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to send meeting invite.",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
