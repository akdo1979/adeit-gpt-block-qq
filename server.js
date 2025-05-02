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

// Основной маршрут
app.post("/gpt", async (req, res) => {
  let userMessage = req.body.message;

  // 1. Извлечение метки языка
  const languageMatch = userMessage.match(/\[LANGUAGE: (\w+)\]/);
  const language = languageMatch ? languageMatch[1] : null;

  // 2. Удаление метки из текста
  userMessage = userMessage.replace(/\[LANGUAGE: \w+\]\s*/, '');

  // 3. Выбор инструкции по языку
  let instruction = "";

  if (language === 'qq') {
    instruction = "Sen her waqıt Qaraqalpaqsha tilinde qisqa, naqty juwap ber. Esh bir tüsindirme, audarma, nemese basqa tilde habar berme.";
  } else if (language === 'ru') {
    instruction = "Ответь кратко. Язык: русский.";
  } else if (language === 'kz') {
    instruction = "Qısqa juwap ber. Til: Qazaqsha.";
  } else if (language === 'en') {
    instruction = "Answer briefly. Language: English.";
  }

  // 4. Формирование сообщений: инструкция и сам вопрос
  try {
    const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: instruction }, // инструкция для ИИ
        { role: "user", content: userMessage }    // сам вопрос от пользователя
      ]
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
