import { ChatGPTAPI } from "chatgpt";
import { config as dotenvConfig } from "dotenv";

const env = dotenvConfig().parsed;
export const api = new ChatGPTAPI({ apiKey: env.OPENAI_API_KEY });
// const api = new ChatGPTAPI({
//     apiKey: process.env.OPENAI_API_KEY,
//     completionParams: {
//       model: 'gpt-4',
//       temperature: 0.5,
//       top_p: 0.8
//     }
//   })
