const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

// Корневой маршрут
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Маршрут для работы с Groq
app.post("/gpt", async (req, res) => {
  let userMessage = req.body.message;

  // Определяем язык из метки
  const languageMatch = userMessage.match(/\[LANGUAGE: (\w+)\]/);
  const language = languageMatch ? languageMatch[1] : null;

  let instruction = "";

  if (language === 'qq') {
    instruction = "Qaraqalpaqsha juwap berin.";
  } else if (language === 'ru') {
    instruction = "Ответь на русском.";
  } else if (language === 'kz') {
    instruction = "Qazaqsha juwap ber.";
  } else if (language === 'en') {
    instruction = "Answer in English.";
  }

  // Удаляем метку из текста
  userMessage = userMessage.replace(/\[LANGUAGE: \w+\]\s*/, '');

  // Формируем финальное сообщение
  const fullMessage = `${instruction}\n${userMessage}`;

  try {
    const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: fullMessage }]
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const gptReply = response.data.choices[0].message.content;
    res.json({ reply: gptReply });

  } catch (error) {
    console.error("Groq API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Groq API error", details: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
