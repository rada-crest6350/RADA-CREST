export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: 'Query is empty' });

  const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";

  const systemContext = `Aap RADA CREST brand ke ultra-smart, friendly aur expert customer support assistant hain.
RADA CREST Store Details:
- Products: LED Bulbs (Radar Motion Sensor lights, Emergency Inverter Bulbs) aur Heavy Duty Extension Boards.
- Website Pages: index.html (Store/Catalog), address.html (Delivery Address), orders.html (Tracking & 7 Days Free Return/Replacement).
- Policies: 7 din ki free replacement damaged ya defective item par. Refund 24-48 working hours me direct bank/UPI me aata hai. COD aur Online UPI dono available hain.

Nirdesh:
1. Customer ke kisi bhi tarah ke sawal ko deeply analyze karein—chahe pricing ki baat ho, product ki quality ho, ya website chalane me dikat ho.
2. Bilkul ek samajhdar dost ki tarah customer ko poori tarah santusht (satisfying) karein aur 3-4 clear points me batayein ki use aage kya karna hai.
3. Kabhi bhi chhota ya adha-adhura jawab na dein.`;

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
        max_tokens: 800
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
