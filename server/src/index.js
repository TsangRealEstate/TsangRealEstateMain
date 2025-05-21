require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/connectors/simple.connector");
const {
  createPredefinedLabels,
  cleanupLabelCollection,
} = require("./models/Label");
const tenantRoutes = require("./routes/tenantRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const movementRoutes = require("./routes/movementRoutes");
const labelRoutes = require("./routes/labelRoutes");
const listingRoutes = require("./routes/listingRoutes");
const scrapeListRoutes = require("./routes/scrapeListRoutes");
const savedUnitRoutes = require("./routes/savedUnitRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://tsangv1.netlify.app"],
  })
);
app.use(express.json());

// Routes
app.use("/api/v1/tenants", tenantRoutes);
app.use("/api/v1/meetings", meetingRoutes);
app.use("/api/v1/movements", movementRoutes);
app.use("/api/v1/labels", labelRoutes);
app.use("/api/v1/listings", listingRoutes);
app.use("/api/v1/scrape-list", scrapeListRoutes);
app.use("/api/v1/saved-units", savedUnitRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome. Server is up and running!" });
});

// Connect to DB and start server
connectDB().then(async () => {
  await cleanupLabelCollection();
  await createPredefinedLabels();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
