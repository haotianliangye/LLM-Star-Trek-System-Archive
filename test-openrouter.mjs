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
      messages: [{role: "user", content: "Hello"}],
      stream: true
    })
  });
  console.log(r.status);
  const reader = r.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let done = false;
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) {
      console.log(decoder.decode(value, { stream: true }));
    }
  }
}
test();
