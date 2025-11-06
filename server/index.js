import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock quotes data
const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Whoever is happy will make others happy too.", author: "Anne Frank" },
  { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", author: "Buddha" },
  { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
  { text: "May you live every day of your life.", author: "Jonathan Swift" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
];

// 1️⃣ Quote API
app.get("/api/quote", async (req, res) => {
  try {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json(randomQuote);
  } catch (error) {
    console.error("Quote API Error:", error.message);
    res.status(500).json({ error: "Could not fetch quote data." });
  }
});

// 2️⃣ Weather API
app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city || "London";
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      // Mock data if no key
      return res.json({
        city,
        temperature: 15,
        condition: "partly cloudy",
        feelsLike: 13,
        humidity: 65,
      });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    const weatherData = {
      city: response.data.name,
      temperature: Math.round(response.data.main.temp),
      condition: response.data.weather[0].description,
      feelsLike: Math.round(response.data.main.feels_like),
      humidity: response.data.main.humidity,
    };

    res.json(weatherData);
  } catch (error) {
    console.error("Weather API Error:", error.message);
    res.status(500).json({ error: "Could not fetch weather data. Please check the city name." });
  }
});

// 3️⃣ Currency API
app.get("/api/currency", async (req, res) => {
  try {
    const amount = parseFloat(req.query.amount) || 100;

    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    const apiKey = process.env.EXCHANGE_RATE_API_KEY;

    if (!apiKey) {
      // Mock conversion rates
      const usdRate = 0.012;
      const eurRate = 0.011;

      return res.json({
        usd: (amount * usdRate).toFixed(2),
        eur: (amount * eurRate).toFixed(2),
        amount,
      });
    }

    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/INR`
    );

    const rates = response.data.conversion_rates;
    const convertedData = {
      usd: (amount * rates.USD).toFixed(2),
      eur: (amount * rates.EUR).toFixed(2),
      amount,
    };

    res.json(convertedData);
  } catch (error) {
    console.error("Currency API Error:", error.message);
    res.status(500).json({ error: "Could not fetch currency conversion data." });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date().toISOString() });
});

  app.listen(PORT, () => {
    console.log(`✅ Server running locally on port ${PORT}`);
  });

