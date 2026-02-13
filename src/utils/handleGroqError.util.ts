import OpenAI from "openai";

/**
 * Maneja los errores de las peticiones a la API de Groq.
 * Centraliza la lógica para evitar duplicación en los servicios.
 */
export const handleGroqError = (error: unknown): never => {
  // Error de la API (4xx, 5xx)
  if (error instanceof OpenAI.APIError) {
    console.error(
      "Error en la respuesta de la API de Groq:",
      error.status,
      error.message,
    );
    throw new Error(
      `Error en la llamada a la API de Groq (HTTP ${error.status}).`,
    );
  }

  // Error de conexión
  if (error instanceof OpenAI.APIConnectionError) {
    console.error("No se recibió respuesta de la API de Groq:", error.message);
    throw new Error("Error de conexión con la API de Groq.");
  }

  // Error inesperado
  console.error("Error inesperado en el servicio Groq:", error);
  throw new Error("Error interno inesperado en el servicio Groq.");
};
