const mongoose = require("mongoose");
const {
  createPredefinedLabels,
  cleanupLabelCollection,
} = require("./models/Label");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB");

    await cleanupLabelCollection();

    await createPredefinedLabels();
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
