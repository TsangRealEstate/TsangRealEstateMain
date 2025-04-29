const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const propertySchema = new Schema({
    externalid: {
        type: String,
        index: true,
        unique: true
    },
    Information: {
        type: Object
    }
}, {
    versionKey: false,
    timestamps: true
});

const PropertyModel = mongoose.models.Property || model("Property", propertySchema, 'property');

module.exports = { PropertyModel };