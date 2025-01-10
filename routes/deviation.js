const express = require("express");
const CryptoStats = require("../models/CryptoStats");

const router = express.Router();

router.get("/", async (req, res) => {
  const { coin } = req.query;
  if (!coin) return res.status(400).json({ error: "Coin is required" });

  const records = await CryptoStats.find({ coin })
    .sort({ timestamp: -1 })
    .limit(100);
  if (records.length === 0)
    return res.status(404).json({ error: "No data found" });

  const prices = records.map((record) => record.price);
  const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;
  const variance =
    prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) /
    prices.length;
  const deviation = Math.sqrt(variance);

  res.json({ deviation: deviation.toFixed(2) });
});

module.exports = router;
