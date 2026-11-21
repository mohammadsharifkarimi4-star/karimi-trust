export default function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_KEY || "";
  res.status(200).json({
    supabaseUrl,
    supabaseKey
  });
}
