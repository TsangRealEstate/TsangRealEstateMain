const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const propertyEmailSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    scrapeListId: {
      type: Schema.Types.ObjectId,
      ref: "ScrapeList",
      required: true,
    },
    scrapeListName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PropertyEmailModel =
  mongoose.models.PropertyEmail ||
  model("PropertyEmail", propertyEmailSchema, "propertyEmails");

module.exports = PropertyEmailModel;
