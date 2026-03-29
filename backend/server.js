import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/summarize", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `Summarize this in 2-3 lines:\n\n${text}`
      })
    });

    const data = await response.json();

    console.log("OpenAI FULL response:", JSON.stringify(data, null, 2));

    // ✅ FIXED SUMMARY LOGIC
    let summary = "No summary generated";

    if (data.output_text) {
      summary = data.output_text;
    } else if (data.output && data.output.length > 0) {
      const content = data.output[0].content;
      if (content && content.length > 0) {
        summary = content[0].text || summary;
      }
    }

    res.json({ summary });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to summarize" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});