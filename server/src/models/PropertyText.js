const mongoose = require("mongoose");
const { Schema } = mongoose;

const propertyTextSchema = new Schema(
    {
        scrapeListId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ScrapeList",
            required: true,
            unique: true,
        },
        specialText: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
            default: "",
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports =
    mongoose.models.PropertyText ||
    mongoose.model("PropertyText", propertyTextSchema);
