const fetch = require('node-fetch'); // wait, built-in fetch is in Node 18+

async function test() {
  const apiKey = process.env.VITE_OPENROUTER_API_KEY || "test";
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "minimax/minimax-m2.5:free",
      messages: [{role: "user", content: "Hello"}]
    })
  });
  console.log(r.status);
  console.log(await r.text());
}
test();
