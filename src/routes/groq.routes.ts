import { Router } from "express";
import controller from "../controllers/groq.controller.js";
import validate from "../utils/validator.util.js";
import { upload } from "../utils/upload.multer.js";
import multerErrorHandler from "../middlewares/multerErrorHandler.middleware.js";
import {
  chatLimiter,
  audioLimiter,
} from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// Endpoint de chat con límite de 20 peticiones por minuto
router.post(
  "/api/groq/chat",
  chatLimiter,
  validate.rules,
  controller.getChatResponse,
);

// Endpoint de audio con límite de 5 peticiones por minuto
router.post(
  "/api/groq/audio",
  audioLimiter,
  upload.single("file"),
  multerErrorHandler,
  controller.getAudioResponse,
);

export default router;
