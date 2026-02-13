import dotenv from "dotenv";
dotenv.config();

import api from "axios";
import FormData from "form-data";

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
    if (api.isAxiosError(error)) {
      if (error.response) {
        console.error(
          "Error en la respuesta de la API de Groq:",
          error.response.status,
          error.response.data,
        );
        throw new Error(
          `Error en la llamada a la API de Groq (HTTP ${error.response.status}).`,
        );
      } else if (error.request) {
        console.error(
          "No se recibió respuesta de la API de Groq:",
          error.request,
        );
        throw new Error("Error de conexión con la API de Groq.");
      }
    }
    console.error("Error inesperado en el servicio Groq:", error);
    throw new Error("Error interno inesperado en el servicio Groq.");
  }
};

const audioCompletion = async (fileBufer: Buffer, fileName: string) => {
  const apiKey = process.env.GROQ_API_KEY;
  const urlAudio = process.env.URL_AUDIO_GROQ_API;

  if (!urlAudio || !apiKey) {
    throw new Error("URL o API key no proporcionados.");
  }

  const form = new FormData();
  form.append("file", fileBufer, { filename: fileName });
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
    if (api.isAxiosError(error)) {
      if (error.response) {
        console.error(
          "Error en la respuesta de la API de Groq:",
          error.response.status,
          error.response.data,
        );
        throw new Error(
          `Error en la llamada a la API de Groq (HTTP ${error.response.status}).`,
        );
      } else if (error.request) {
        console.error(
          "No se recibió respuesta de la API de Groq:",
          error.request,
        );
        throw new Error("Error de conexión con la API de Groq.");
      }
    }
    console.error("Error inesperado en el servicio Groq:", error);
    throw new Error("Error interno inesperado en el servicio Groq.");
  }
};

const service = {
  chatCompletion,
  audioCompletion,
};

export default service;
