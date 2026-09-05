export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: 'Query empty' });

  // YAHAN APNI GROQ KEY PASTE KAREIN
  const GROQ_API_KEY = process.env.GROQ_API_KEY || "YAHAN_APNI_GROQ_KEY_DAALEIN";

  const systemContext = `Aap RADA CREST brand ke ultra-intelligent, friendly customer support AI hain.
Store Details:
- Website: LED Bulbs (Radar Motion sensor, emergency inverter) aur Heavy Extension Boards bechti hai.
- Process: Customer index.html par jakar item dekhta hai, Buy Now dabata hai, address.html par pata bharta hai, aur COD ya UPI se order confirm karta hai.
- Policies: 7 din ki free replacement kharab/damaged saman par. 24-48 ghante me refund seedha bank account me.

Rules:
1. Customer ke sawal ko deeply analyze karein chahe tooti-footi Hindi ho ya Hinglish (jaise 'ME AGE KYA KATU' ya 'khol li aage kya karu').
2. Bilkul ek samajhdar dost ki tarah Step 1, Step 2, Step 3 karke complete, detailed aur practical rasta samjhayein ki website par use abhi kya karna hai.
3. Chhota ya template jawab mat dein, poora vistaar se guide karein.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
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
      console.error("Groq API Error Detail:", data);
      return res.status(500).json({ error: data.error?.message || "Groq failed" });
    }
  } catch (err) {
    console.error("Fetch Exception:", err);
    return res.status(500).json({ error: err.message });
  }
}
