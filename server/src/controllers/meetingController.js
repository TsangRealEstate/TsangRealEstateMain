const Tenant = require("../models/Tenant");
const SavedUnit = require("../models/SavedUnit");
const PropertyEmailModel = require("../models/PropertyEmail");
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
const propertyNotificationPath = path.join(
  __dirname,
  "../../views/property-notification.hbs"
);
const submissionTemplatePath = path.join(
  __dirname,
  "../../views/submission-notification.hbs"
);

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

const sendPropertyNotification = async (
  propertyEmail,
  tenant,
  propertyArea
) => {
  try {
    const template = await fs.promises.readFile(
      propertyNotificationPath,
      "utf8"
    );

    const html = renderTemplate(template, {
      propertyArea,
      client: {
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        mobileNumber: tenant.mobileNumber,
        email: tenant.email,
        instagram: tenant.instagram,
      },
      supportEmail: process.env.SUPPORT_EMAIL || "support@tsangrealestate.com",
    });

    const mailOptions = {
      from: `"Tsang Real Estate" <${process.env.EMAIL_USER}>`,
      to: propertyEmail,
      subject: `New Client Interest for ${propertyArea}`,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(`Error sending notification for ${propertyArea}:`, error);
    return false;
  }
};

const sendClientInfoToPropertyOwner = async (tenantId) => {
  try {
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) throw new Error("Tenant not found.");

    const savedUnitsDocs = await SavedUnit.find({ tenantId })
      .sort({ timestamp: -1 })
      .lean()
      .exec();
    if (!savedUnitsDocs?.length) throw new Error("No saved units found.");

    const allAreas = [
      ...new Set(
        savedUnitsDocs.flatMap((doc) =>
          doc.selectedUnits.map((unit) => unit.propertyArea).filter(Boolean)
        )
      ),
    ];

    if (!allAreas.length) throw new Error("No property areas found.");

    const areaEmails = await PropertyEmailModel.find({
      scrapeListName: { $in: allAreas },
    }).lean();

    const areasWithEmails = allAreas.map((area) => {
      const match = areaEmails.find((e) => e.scrapeListName === area);
      return {
        propertyArea: area,
        email: match?.email || null,
        scrapeListId: match?.scrapeListId || null,
      };
    });

    const emailResults = await Promise.all(
      areasWithEmails.map(async (area) => {
        if (area.email) {
          const success = await sendPropertyNotification(
            area.email,
            tenant,
            area.propertyArea
          );
          return {
            propertyArea: area.propertyArea,
            sent: success,
            email: area.email,
          };
        }
        return {
          propertyArea: area.propertyArea,
          sent: false,
          reason: "No email on file",
        };
      })
    );

    return {
      success: true,
      tenant: `${tenant.firstName} ${tenant.lastName}`,
      notifications: emailResults,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Error in sendClientInfoToPropertyOwner:", error);
    throw error;
  }
};

const sendSubmissionNotification = async (tenantId) => {
  try {
    const tenant = await Tenant.findById(tenantId).lean();
    if (!tenant) {
      throw new Error("Tenant record not found in database");
    }

    const userEmail = tenant.email;
    if (!userEmail || userEmail === "default@example.com") {
      return {
        success: false,
        reason: "Invalid or default email address",
      };
    }

    const template = await fs.promises.readFile(submissionTemplatePath, "utf8");

    // Helper functions
    const formatDate = (dateString) => {
      if (!dateString) return "Not specified";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      } catch (e) {
        console.error("Date formatting error:", e);
        return dateString;
      }
    };

    const capitalize = (str) => {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // Prepare template data
    const templateData = {
      ...tenant,
      submittedAt: formatDate(new Date()),
      preferences: {
        searchType: capitalize(tenant.searchType),
        budget: `$${tenant.budget}`,
        bedrooms: tenant.bedrooms,
        bathrooms: tenant.bathrooms,
        desiredLocation: tenant.desiredLocation,
        grossIncome: tenant.grossIncome
          ? `$${tenant.grossIncome}`
          : "Not specified",
        creditScore: tenant.creditScore,
        OtherOnLease: capitalize(tenant.OtherOnLease),
        othersOnLeasevalue: tenant.othersOnLeasevalue,
        brokenLease: tenant.brokenLease,
        AvailabilityDate: formatDate(tenant.AvailabilityDate),
        leaseStartDate: formatDate(tenant.leaseStartDate),
        leaseEndDate: formatDate(tenant.leaseEndDate),
        timeForCall: tenant.timeForCall,
        nonNegotiables: tenant.nonNegotiables,
        propertyOwnerName: tenant.propertyOwnerName,
        closingTimeline: tenant.closingTimeline,
        preApproval: tenant.preApproval,
        preApprovalAmount: tenant.preApprovalAmount,
      },
      formatDate,
      capitalize,
    };

    // Render and send email
    const html = renderTemplate(template, templateData);

    const mailOptions = {
      from: `"Property Match Team" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "✅ Your Application Has Been Received - Next Steps",
      html,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
      },
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Notification processing failed:", error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

module.exports = {
  sendMeetingInvite,
  sendUnitsToTenant,
  sendSubmissionNotification,
  sendClientInfoToPropertyOwner,
};
