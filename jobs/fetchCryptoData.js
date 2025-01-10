const axios = require("axios");
const CryptoStats = require("../models/CryptoStats");

const fetchCryptoData = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: "bitcoin,matic-network,ethereum",
          vs_currencies: "usd",
          include_market_cap: "true",
          include_24hr_change: "true",
        },
      }
    );

    const data = response.data;

    const coins = [
      { id: "bitcoin", name: "Bitcoin" },
      { id: "matic-network", name: "Matic" },
      { id: "ethereum", name: "Ethereum" },
    ];

    for (const coin of coins) {
      const stats = new CryptoStats({
        coin: coin.id,
        price: data[coin.id].usd,
        marketCap: data[coin.id].usd_market_cap,
        change24h: data[coin.id].usd_24h_change,
      });

      await stats.save();
      console.log(`Saved data for ${coin.name}`);
    }
  } catch (error) {
    console.error("Error fetching cryptocurrency data:", error.message);
  }
};

module.exports = fetchCryptoData;
