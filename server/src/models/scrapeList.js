const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ScrapeStatus = {
    Success: 'success',
    Failed: 'failed',
    None: 'none'
};

const scrapeList = new Schema({
    title: {
        type: String
    },
    destinationURL: {
        type: String,
        index: true,
        unique: true
    },
    lastScrapeInfo: {
        type: String,
        enum: Object.values(ScrapeStatus),
        default: ScrapeStatus.None
    },
    Information: {
        type: Object
    }
}, {
    versionKey: false,
    timestamps: true
});

const ScrapeListModel = mongoose.models.ScrapeList || model("ScrapeList", scrapeList, 'scrapeList');

module.exports = { ScrapeListModel, ScrapeStatus };