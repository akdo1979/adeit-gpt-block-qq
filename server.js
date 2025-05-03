const express = require("express");
const cors = require("cors");
const { Groq } = require("groq-sdk");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Инициализация Groq SDK
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Корневой маршрут
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Основной маршрут
app.post("/gpt", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    const gptReply = chatCompletion.choices[0].message.content;
    res.json({ reply: gptReply });

  } catch (error) {
    console.error("Groq SDK error:", error.message);
    res.status(500).json({ error: "Groq SDK error", details: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
