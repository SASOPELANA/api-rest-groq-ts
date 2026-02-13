import rateLimit from "express-rate-limit";

// ============================================
// 1. LÍMITE GLOBAL PARA TODA LA API
// ============================================
// Protege toda la aplicación de abuso general
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 peticiones por ventana
  message: {
    error: "Demasiadas peticiones",
    message:
      "Has excedido el límite de 100 peticiones cada 15 minutos. Por favor, intenta más tarde.",
    retryAfter: "15 minutos",
  },
  standardHeaders: true, // Devuelve info en headers `RateLimit-*`
  legacyHeaders: false, // Desactiva headers `X-RateLimit-*`
});

// ============================================
// 2. LÍMITE ESPECÍFICO PARA CHAT
// ============================================
// Más permisivo porque son peticiones ligeras
export const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 20, // Máximo 20 peticiones por minuto
  message: {
    error: "Límite de chat excedido",
    message:
      "Has alcanzado el límite de 20 mensajes por minuto. Espera un momento antes de continuar.",
    retryAfter: "1 minuto",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Función personalizada para el mensaje (opcional)
  handler: (req, res) => {
    res.status(429).json({
      error: "Límite de chat excedido",
      message:
        "Has alcanzado el límite de 20 mensajes por minuto. Espera un momento antes de continuar.",
      retryAfter: "1 minuto",
      resetTime: new Date(Date.now() + 60000).toISOString(), // Cuándo se resetea
    });
  },
});

// ============================================
// 3. LÍMITE ESPECÍFICO PARA AUDIO
// ============================================
// Más restrictivo porque el procesamiento es pesado
export const audioLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 5, // Máximo 5 peticiones por minuto
  message: {
    error: "Límite de transcripción excedido",
    message:
      "Has alcanzado el límite de 5 transcripciones por minuto. El procesamiento de audio consume muchos recursos.",
    retryAfter: "1 minuto",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Límite de transcripción excedido",
      message:
        "Has alcanzado el límite de 5 transcripciones por minuto. El procesamiento de audio consume muchos recursos.",
      retryAfter: "1 minuto",
      resetTime: new Date(Date.now() + 60000).toISOString(),
    });
  },
});

// ============================================
// 4. LÍMITE DIARIO (OPCIONAL)
// ============================================
// Si quieres limitar el uso diario total
export const dailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 horas
  max: 1000, // Máximo 1000 peticiones por día
  message: {
    error: "Límite diario excedido",
    message:
      "Has alcanzado el límite diario de 1000 peticiones. Vuelve mañana para continuar usando la API.",
    retryAfter: "24 horas",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const resetTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
    res.status(429).json({
      error: "Límite diario excedido",
      message:
        "Has alcanzado el límite diario de 1000 peticiones. Vuelve mañana para continuar usando la API.",
      retryAfter: "24 horas",
      resetTime: resetTime.toISOString(),
      resetDate: resetTime.toLocaleDateString("es-ES"),
    });
  },
});
