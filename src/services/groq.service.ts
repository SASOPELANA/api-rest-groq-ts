import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import { handleGroqError } from "../utils/handleGroqError.util.js";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1",
});

const chatCompletion = async (userInput: string) => {
  try {
    const response = await client.chat.completions.create({
      messages: [{ content: userInput, role: "user" }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });
    return response;
  } catch (error) {
    handleGroqError(error);
  }
};

const audioCompletion = async (fileBuffer: Buffer, fileName: string) => {
  try {
    const file = new File([new Uint8Array(fileBuffer)], fileName, {
      type: "audio/mpeg",
    });
    const response = await client.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3",
    });
    return response;
  } catch (error) {
    handleGroqError(error);
  }
};

const service = {
  chatCompletion,
  audioCompletion,
};

export default service;
