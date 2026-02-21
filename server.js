require("dotenv").config();

const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(express.json());

console.log("Using key:", process.env.GEMINI_API_KEY?.slice(0, 8));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  apiVersion: "v1"
});

app.get("/models", async (req, res) => {
  try {
    const models = await ai.models.list();
    res.json(models);
  } catch (error) {
    console.error("MODEL LIST ERROR:", error);
    res.status(500).json({ error: "Model list failed" });
  }
});

app.post("/critique", async (req, res) => {
  const { skillLevel, intent, constraints } = req.body;

  const prompt = `
You are an art critique assistant.

Skill level: ${skillLevel}
Intent: ${intent}
Constraints: ${constraints}

Return feedback in this format:
Strengths:
Improvements:
Exercise:
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ critique: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Model error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});