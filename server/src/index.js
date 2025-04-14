require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const tenantRoutes = require("./routes/tenantRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const movementRoutes = require("./routes/movementRoutes");
const labelRoutes = require("./routes/labelRoutes");

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

app.get("/", (req, res) => {
  res.json({ message: "Welcome. Server is up and running!" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
