import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function generateAIResponse(message) {
  const completion = await openai.chat.completions.create({
    model: process.env.MODEL_NAME,
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
    temperature: 0.7,
    top_p: 0.8,
    max_tokens: 4096,
  });

  return completion.choices[0].message.content;
}