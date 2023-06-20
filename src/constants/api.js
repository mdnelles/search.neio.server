import { Configuration, OpenAIApi } from "openai";
import { config as dotenvConfig } from "dotenv";

const env = dotenvConfig().parsed;

const configuration = new Configuration({
   apiKey: env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);
