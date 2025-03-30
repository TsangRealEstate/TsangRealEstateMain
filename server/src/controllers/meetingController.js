const Tenant = require("../models/Tenant");
const nodemailer = require("nodemailer");
const hbs = require("hbs");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const templatePath = path.join(__dirname, "../../views/meeting-invite.hbs");

const renderTemplate = (template, data) => {
  const compiledTemplate = hbs.handlebars.compile(template);
  return compiledTemplate(data);
};

const sendMeetingInvite = async (id) => {
  try {
    const tenant = await Tenant.findById(id);
    if (!tenant) {
      throw new Error("Tenant not found.");
    }

    const userEmail = tenant.email;
    const eventSchedulingUrl = process.env.CALENDLY_EVENT_LINK;

    if (!userEmail || !eventSchedulingUrl) {
      throw new Error("Missing userEmail or Event Scheduling URL.");
    }

    const template = await fs.promises.readFile(templatePath, "utf8");
    const html = renderTemplate(template, {
      firstName: tenant.firstName,
      eventSchedulingUrl,
    });

    const mailOptions = {
      from: `"Agent Team" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "📅 Meeting Invitation - Schedule a Meeting",
      html,
    };

    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error("Error sending meeting invite:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendMeetingInvite };
