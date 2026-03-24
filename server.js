import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const TARGET_ID = process.env.TARGET_ID;

app.post("/send", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Missing message" });

    const body = {
      to: TARGET_ID,
      messages: [{ type: "text", text: message }]
    };

    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    if (!response.ok) return res.status(response.status).send(text);

    res.json({ ok: true, result: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => res.send("LINE backend is running ✅"));

app.listen(PORT, () => console.log("Server running on port", PORT));
