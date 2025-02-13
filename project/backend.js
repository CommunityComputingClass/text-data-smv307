const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/api/get-google-api-key", (req, res) => {
  res.json({ apiKey: process.env.GOOGLE_API_KEY });
});

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
