const Tenant = require("../models/Tenant");
const { sendMeetingInvite } = require("./meetingController");

// ✅ Create or Update a Tenant
const createOrUpdateTenant = async (req, res) => {
    try {
        const tenantData = req.body;
        const { email } = tenantData;

        if (!email) {
            return res.status(400).json({ error: "Email is required." });
        }

        let tenant;
        let message;

        if (await Tenant.findOne({ email })) {
            tenant = await Tenant.findOneAndUpdate(
                { email },
                { $set: tenantData },
                { new: true, runValidators: true }
            );
            message = "Tenant updated successfully!";
        } else {
            tenant = new Tenant(tenantData);
            await tenant.save();
            message = "Tenant created successfully!";
        }

        const inviteResult = await sendMeetingInvite(tenant._id);
        return res.status(tenant.isNew ? 201 : 200).json({
            message: `${message} Meeting invite ${inviteResult.success ? "sent!" : "failed!"
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

module.exports = {
    createOrUpdateTenant,
    getAllTenants,
};
