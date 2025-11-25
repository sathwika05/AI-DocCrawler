import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";

dotenv.config();

const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-3.5-turbo",
});

const response = await llm.invoke(
  "Describe the importance of learning generative AI for javascript developers in 50 words."
);

console.log(response);
