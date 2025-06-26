const mongoose = require('mongoose');
const { Schema } = mongoose;

const agentNoteSchema = new Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    },
    scrapeListId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ScrapeList',
        required: true
    },
    propertyArea: {
        type: String,
        required: true
    },
    propertyNote: {
        type: String,
        required: true,
        trim: true
    },

    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    versionKey: false
});

// Compound index for efficient querying
agentNoteSchema.index({ tenantId: 1, scrapeListId: 1 });

module.exports = mongoose.models.AgentNote ||
    mongoose.model('AgentNote', agentNoteSchema);