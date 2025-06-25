const PropertyText = require('../models/PropertyText');
const { ScrapeListModel } = require('../models/scrapeList');

exports.createOrUpdatePropertyText = async (req, res) => {
    try {
        const { scrapeListId, specialText, notes } = req.body;

        const scrapeListExists = await ScrapeListModel.findById(scrapeListId);
        if (!scrapeListExists) {
            return res.status(404).json({ error: 'ScrapeList not found' });
        }

        const propertyText = await PropertyText.findOneAndUpdate(
            { scrapeListId },
            { specialText, notes },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.status(200).json({
            message: 'Property text saved successfully',
            data: propertyText
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to save property text',
            details: error.message
        });
    }
};

exports.getPropertyText = async (req, res) => {
    try {
        const { scrapeListId } = req.params;

        const propertyText = await PropertyText.findOne({ scrapeListId })
            .populate('scrapeListId', 'title destinationURL');

        if (!propertyText) {
            return res.status(404).json({ error: 'Property text not found' });
        }

        res.status(200).json(propertyText);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch property text',
            details: error.message
        });
    }
};

exports.updatePropertyText = async (req, res) => {
    try {
        const { scrapeListId } = req.params;
        const { specialText, notes } = req.body;

        const updatedText = await PropertyText.findOneAndUpdate(
            { scrapeListId },
            { specialText, notes },
            { new: true, runValidators: true }
        );

        if (!updatedText) {
            return res.status(404).json({ error: 'Property text not found' });
        }

        res.status(200).json({
            message: 'Property text updated successfully',
            data: updatedText
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to update property text',
            details: error.message
        });
    }
};