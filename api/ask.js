export default async function handler(req, res) {
  // CORS Headers allow karein
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // Yahan apni Groq API Key daalein
  const GROQ_API_KEY = process.env.GROQ_API_KEY || "YAHAN_APNI_GROQ_KEY_DAALEIN";

  const systemContext = `Aap RADA CREST brand ke personal AI customer support guide hain.
RADA CREST Website ki Jankari:
- index.html: Storefront jahan LED lights (Motion Radar bulb, Inverter emergency bulb) aur Heavy extension boards milte hain. Customer item pasand karke 'Buy Now' dabata hai.
- address.html: Jahan customer apna delivery address chunta ya naya address jodta hai.
- orders.html: Jahan customer past orders track kar sakta hai aur 7 dino ke andar 'Request Return' kar sakta hai.
- Policies: 7 din ki free replacement milti hai agar bulb/board kharab ya damaged nikle. Refund cancel/return ke 24-48 ghante me direct bank/UPI me credit hota hai. Cash on Delivery (COD) aur Online UPI dono uplabdh hain.

Nirdesh:
- Customer ke sawal ko dhyan se samajh kar bilkul dost ki tarah (warm, friendly) Hinglish aur Hindi me point-by-point gehra aur clear guidance dein.
- Kabhi bhi chhota ya adha-adhura jawab na dein. Step 1, Step 2 karke samjhayein ki website par aage kahan jana hai aur kya karna hai.`;

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
        max_tokens: 600
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0]) {
      return res.status(200).json({ answer: data.choices[0].message.content });
    } else {
      throw new Error(data.error?.message || "Invalid API response");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
