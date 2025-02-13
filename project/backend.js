const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(express.static("public"));

app.get("/api/get-google-api-key", (req, res) => {
  res.json({ apiKey: process.env.GOOGLE_API_KEY });
});
