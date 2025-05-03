const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Groq } = require("groq-sdk");

const app = express();
app.use(express.json());
app.use(cors());

// Инициализация Groq SDK
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/gpt", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: userMessage }],
      model: "llama3-70b-8192"
    });

    const reply = chatCompletion.choices[0]?.message?.content || "Нет ответа.";
    res.json({ reply });
  } catch (error) {
    console.error("Groq API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Groq API error", details: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
