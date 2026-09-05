export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: 'Query is empty' });

  // Aapki Active Groq Key
  const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";

  const systemContext = `Aap RADA CREST brand ke personal AI customer support assistant hain.
RADA CREST Store Details:
- Products: LED Bulbs (Radar Motion Sensor lights, Inverter emergency lights) aur Heavy duty Extension Boards.
- Website flow:
  * index.html: Storefront jahan products dekh kar customer 'Buy Now' dabata hai.
  * address.html: Jahan customer apna delivery address chunta ya naya address save karta hai.
  * orders.html: Jahan customer apne orders track kar sakta hai aur return request daal sakta hai.
- Policies: 7 din ki free replacement policy agar bulb/board me koi damage ya defect ho. Refund cancel/return ke 24-48 working ghante me direct bank/UPI me aata hai. Cash on Delivery (COD) aur Online UPI dono uplabdh hain.

Rules:
1. Customer ke sawal ko dhyan se samjhein, chahe woh tooti-footi Hindi, Hinglish ya English me ho (jaise: 'me age kya karu', 'order kaise book karu', 'bulb nahi jal raha').
2. Bilkul ek sachche dost ki tarah Step 1, Step 2, Step 3 karke simple, seedha aur practical rasta samjhayein ki website par aage kahan jana hai aur kya dabana hai.
3. Koi chhota ya boring template jawab na dein, detailed aur helpful guide karein.`;

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
      console.error("Groq API Error:", data);
      return res.status(500).json({ error: data.error?.message || "Groq request failed" });
    }
  } catch (err) {
    console.error("Server Exception:", err);
    return res.status(500).json({ error: err.message });
  }
}
