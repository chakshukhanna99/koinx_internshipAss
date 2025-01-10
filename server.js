const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cron = require("node-cron");
const statsRoutes = require("./routes/stats");
const deviationRoutes = require("./routes/deviation");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
// Routes
app.use("/stats", statsRoutes);
app.use("/deviation", deviationRoutes);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("Database connection error:", error));

// Schedule background job
cron.schedule("0 */2 * * *", async () => {
  console.log("Running background job to fetch cryptocurrency data...");
  await fetchCryptoData();
});
