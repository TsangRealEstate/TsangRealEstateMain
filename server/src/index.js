require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const tenantRoutes = require("./routes/tenantRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const movementRoutes = require("./routes/movementRoutes");

app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Start the Server AFTER DB Connects
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect:", err);
    process.exit(1);
  }
};

// Routes
app.use("/api/v1/tenants", tenantRoutes);
app.use("/api/v1/meetings", meetingRoutes);
app.use("/api/v1/movements", movementRoutes);

app.get("/", (req, res) => {
  res.send("Hello, Express with MongoDB!");
});

connectDB();
