import dotenv from "dotenv";
dotenv.config();

import api from "axios";
import FormData from "form-data";
import { handleGroqError } from "../utils/handleGroqError.util.js";

const chatCompletion = async (userInput: string) => {
  const url = process.env.URL_GROQ_API;
  const apiKey = process.env.GROQ_API_KEY;

  if (!url || !apiKey) {
    throw new Error("URL o API key no proporcionados.");
  }

  const data = {
    messages: [{ content: userInput, role: "user" }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
  };

  const config = {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await api.post(url, data, config);
    return response.data;
  } catch (error) {
    handleGroqError(error);
  }
};

const audioCompletion = async (fileBuffer: Buffer, fileName: string) => {
  const apiKey = process.env.GROQ_API_KEY;
  const urlAudio = process.env.URL_AUDIO_GROQ_API;

  if (!urlAudio || !apiKey) {
    throw new Error("URL o API key no proporcionados.");
  }

  const form = new FormData();
  form.append("file", fileBuffer, { filename: fileName });
  form.append("model", "whisper-large-v3");

  try {
    const response = await api.post(urlAudio, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.data;
  } catch (error) {
    handleGroqError(error);
  }
};

const service = {
  chatCompletion,
  audioCompletion,
};

export default service;
