const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ItEra backend running.");
});

app.post("/critique", (req, res) => {
  const { skillLevel, intent, constraints } = req.body;

  console.log("Received:", skillLevel, intent, constraints);

  res.json({
    strengths: "Placeholder strength.",
    improvements: "Placeholder improvement.",
    exercise: "Placeholder exercise."
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});