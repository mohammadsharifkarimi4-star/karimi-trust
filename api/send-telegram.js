export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { chat_id, text, parse_mode = "Markdown" } = req.body || {};
    const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();

    if (!token || !chat_id || !text) {
      return res.status(400).json({ ok: false, error: "Missing TELEGRAM_BOT_TOKEN, chat_id, or text" });
    }

    const tgResp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: String(chat_id).trim(),
        text: String(text),
        parse_mode
      })
    });

    const data = await tgResp.json();
    return res.status(tgResp.status).json(data);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || "Telegram send error" });
  }
}
