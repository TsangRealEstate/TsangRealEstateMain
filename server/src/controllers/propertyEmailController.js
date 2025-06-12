const PropertyEmailModel = require("../models/PropertyEmail");
const { ScrapeListModel } = require("../models/scrapeList");

const propertyEmailController = {
    create: async (req, res) => {
        try {
            const { email, scrapeListId,scrapeListName } = req.body;

            if (!email || !scrapeListId) {
                return res
                    .status(400)
                    .json({ error: "Email and scrapeListId are required" });
            }

            
            const scrapeListExists = await ScrapeListModel.exists({
                _id: scrapeListId,
            });
            if (!scrapeListExists) {
                return res.status(404).json({ error: "ScrapeList not found" });
            }

            // First check if email exists for this scrapeListId
            const existingRecord = await PropertyEmailModel.findOne({ scrapeListId });

            if (existingRecord) {
                existingRecord.email = email;
                await existingRecord.save();
                return res.status(200).json({
                    message: "Email updated successfully",
                    data: existingRecord,
                });
            }

            const newPropertyEmail = new PropertyEmailModel({ email, scrapeListId,scrapeListName });
            await newPropertyEmail.save();

            res.status(201).json({
                message: "Email created successfully",
                data: newPropertyEmail,
            });
        } catch (error) {
            // Handle duplicate key errors specifically
            if (error.code === 11000) {
                return res.status(400).json({
                    error: "This email already exists for another property",
                });
            }
            res.status(500).json({ error: error.message });
        }
    },

    
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
