import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  const req = ai.chats.create({
    model: "gemini-3.1-flash-lite-preview",
    config: {
      systemInstruction: 'You are an Oracle. Reply in Chinese.'
    }
  });

  const stream = await req.sendMessageStream({ message: '介绍一下你自己关于RoPE' });
  for await (const chunk of stream) {
    if (chunk.text) {
      process.stdout.write(chunk.text);
    }
  }
  console.log("\nDone!");
}
test();
