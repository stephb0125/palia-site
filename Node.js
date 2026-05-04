import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askAI(req, res) {
  const { question } = req.body;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "You are a helpful Palia game assistant."
      },
      {
        role: "user",
        content: question
      }
    ]
  });

  res.json({ answer: response.choices[0].message.content });
}
