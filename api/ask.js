export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: 'Query is empty' });

  const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";

  const systemContext = `Aap RADA CREST brand ke smart aur friendly customer support assistant hain. 
RADA CREST store par LED bulbs aur extension boards milte hain. Customer ko index.html (store), address.html (address) aur orders.html (tracking/return) ka rasta step-by-step Hinglish me samjhayein.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemContext },
          { role: "user", content: query }
        ],
        temperature: 0.6,
        max_tokens: 600
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      return res.status(200).json({ answer: data.choices[0].message.content });
    } else {
      return res.status(500).json({ error: data.error?.message || "API failed" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
