export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const supabaseUrl = (process.env.SUPABASE_URL || "").trim();
  const supabaseKey = (process.env.SUPABASE_KEY || "").trim();

  return res.status(200).json({
    ok: true,
    supabaseUrl,
    supabaseKey
  });
}
