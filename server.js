import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages ต้องเป็น array" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: messages,
    });

    const reply = completion.choices[0].message;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์",
      detail: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
