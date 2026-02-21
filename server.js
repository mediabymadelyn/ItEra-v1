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

Respond ONLY in valid JSON.
Do not include explanations.
Do not include markdown.
Do not include backticks.

Use this exact format:

{
  "Strengths": "string",
  "Improvements": "string",
  "Exercise": "string"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    const rawText = response.candidates[0].content.parts[0].text;

    let parsed;

    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.error("JSON PARSE ERROR:", rawText);
      return res.status(500).json({ error: "Invalid JSON from model" });
    }

    return res.json(parsed);

  } catch (error) {
    console.error("FULL ERROR:", error);
    return res.status(500).json({ error: "Model error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});