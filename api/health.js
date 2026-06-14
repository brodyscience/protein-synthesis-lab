export default async function handler(_req, res) {
  return res.status(200).json({
    ok: true,
    hasApiKey: Boolean(process.env.ANTHROPIC_API_KEY),
  })
}
