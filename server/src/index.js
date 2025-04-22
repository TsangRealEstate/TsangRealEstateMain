require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const {
  createPredefinedLabels,
  cleanupLabelCollection,
} = require("./models/Label");
const tenantRoutes = require("./routes/tenantRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const movementRoutes = require("./routes/movementRoutes");
const labelRoutes = require("./routes/labelRoutes");
const listingRoutes = require("./routes/listingRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Routes
app.use("/api/v1/tenants", tenantRoutes);
app.use("/api/v1/meetings", meetingRoutes);
app.use("/api/v1/movements", movementRoutes);
app.use("/api/v1/labels", labelRoutes);
app.use("/api/v1/listings", listingRoutes);

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
