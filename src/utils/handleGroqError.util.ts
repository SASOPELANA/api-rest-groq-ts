import axios from "axios";

/**
 * Maneja los errores de las peticiones a la API de Groq.
 * Centraliza la lógica para evitar duplicación en los servicios.
 */
export const handleGroqError = (error: unknown): never => {
  // Error con respuesta del servidor (4xx, 5xx)
  if (axios.isAxiosError(error) && error.response) {
    console.error(
      "Error en la respuesta de la API de Groq:",
      error.response.status,
      error.response.data,
    );
    throw new Error(
      `Error en la llamada a la API de Groq (HTTP ${error.response.status}).`,
    );
  }

  // Error sin respuesta (timeout, red caída, etc.)
  if (axios.isAxiosError(error) && error.request) {
    console.error("No se recibió respuesta de la API de Groq:", error.request);
    throw new Error("Error de conexión con la API de Groq.");
  }

  // Error inesperado
  console.error("Error inesperado en el servicio Groq:", error);
  throw new Error("Error interno inesperado en el servicio Groq.");
};
