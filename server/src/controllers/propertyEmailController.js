const PropertyEmailModel = require("../models/PropertyEmail");
const { ScrapeListModel } = require("../models/scrapeList");

const propertyEmailController = {
    // Create a new property email
    create: async (req, res) => {
        try {
            const { email, scrapeListId } = req.body;

            // Check if the scrapeList exists
            const scrapeList = await ScrapeListModel.findById(scrapeListId);
            if (!scrapeList) {
                return res.status(404).json({ error: "ScrapeList not found" });
            }

            // Check if email already exists for this scrapeList
            const existingEmail = await PropertyEmailModel.findOne({
                email,
                scrapeListId,
            });
            if (existingEmail) {
                return res
                    .status(400)
                    .json({ error: "Email already exists for this property" });
            }

            const propertyEmail = new PropertyEmailModel({ email, scrapeListId });
            await propertyEmail.save();

            res.status(201).json(propertyEmail);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all property emails
    getAll: async (req, res) => {
        try {
            const propertyEmails = await PropertyEmailModel.find().populate(
                "scrapeListId"
            );
            res.json(propertyEmails);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get property emails by scrapeList ID
    getByScrapeListId: async (req, res) => {
        try {
            const { scrapeListId } = req.params;
            const propertyEmails = await PropertyEmailModel.find({
                scrapeListId,
            }).populate("scrapeListId");
            res.json(propertyEmails);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete a property email
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedEmail = await PropertyEmailModel.findByIdAndDelete(id);
            if (!deletedEmail) {
                return res.status(404).json({ error: "Property email not found" });
            }
            res.json({ message: "Property email deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = propertyEmailController;
