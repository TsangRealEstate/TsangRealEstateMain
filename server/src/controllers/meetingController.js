const Tenant = require("../models/Tenant");
const SavedUnit = require("../models/SavedUnit");
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
const unitsTemplatePath = path.join(__dirname, "../../views/units-email.hbs");

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

const sendUnitsToTenant = async (tenantId) => {
  try {
    // 1. Get tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      throw new Error("Tenant not found.");
    }

    // 2. Get saved units for this tenant
    const savedUnitsDocs = await SavedUnit.find({ tenantId })
      .sort({ timestamp: -1 })
      .lean()
      .exec();

    if (!savedUnitsDocs || savedUnitsDocs.length === 0) {
      throw new Error("No saved units found for this tenant.");
    }

    // 3. Extract all unique property areas from selectedUnits
    const allAreas = [];
    savedUnitsDocs.forEach((doc) => {
      doc.selectedUnits.forEach((unit) => {
        if (unit.propertyArea && !allAreas.includes(unit.propertyArea)) {
          allAreas.push(unit.propertyArea);
        }
      });
    });

    if (allAreas.length === 0) {
      throw new Error("No property areas found in saved units.");
    }

    // 4. Generate tenant link
    const tenantFullName = `${tenant.firstName} ${tenant.lastName}`.trim();
    const tenantLink = `${
      process.env.CLIENT_URL
    }/user?tenant=${encodeURIComponent(tenantFullName)}&userId=${tenant._id}`;

    // 5. Prepare email content
    const template = await fs.promises.readFile(unitsTemplatePath, "utf8");
    const html = renderTemplate(template, {
      firstName: tenant.firstName,
      areas: allAreas,
      count: allAreas.length,
      date: new Date().toLocaleDateString(),
      tenantLink: tenantLink,
    });

    // 6. Send email
    const mailOptions = {
      from: `"Property Match Team" <${process.env.EMAIL_USER}>`,
      to: tenant.email,
      subject: `Your Custom Property Matches (${allAreas.length} areas)`,
      html,
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      areas: allAreas,
      count: allAreas.length,
      tenantLink: tenantLink,
    };
  } catch (error) {
    console.error("Error sending units to tenant:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendMeetingInvite, sendUnitsToTenant };
