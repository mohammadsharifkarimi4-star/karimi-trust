export default function handler(req, res) {
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  const envPayload = {
    SUPABASE_URL: process.env.SUPABASE_URL || "",
    SUPABASE_KEY: process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || "",
    MASTER_OWNER: process.env.MASTER_OWNER || "محمد شریف کریمی"
  };

  res.status(200).send(`window.__ENV__ = ${JSON.stringify(envPayload)};`);
}
