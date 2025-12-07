import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(
  cors({
    origin: "*", // TODO: ganti dengan domain Netlify kamu untuk production
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Portfolio chatbot backend running" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res
        .status(400)
        .json({ error: "'messages' must be an array of chat messages" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.6,
    });

    const reply = completion.choices?.[0]?.message?.content ?? "";
    res.json({ reply });
  } catch (error) {
    console.error("Groq chat error:", error);
    res.status(500).json({ error: "Failed to get response from Groq" });
  }
});

app.listen(port, () => {
  console.log(`Groq chatbot backend listening on port ${port}`);
});
