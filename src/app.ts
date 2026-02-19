import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

import indexRoutes from "../src/routes/index.routes.js";
import groqRoutes from "../src/routes/groq.routes.js";
import middleware from "../src/middlewares/notFound.middleware.js";
import { globalLimiter } from "../src/middlewares/rateLimiter.middleware.js";

const app = express();

// settings
app.use(helmet()); // --> primer middleware de seguridad
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend permitido
    credentials: true,
  }),
); // --> hacerlo con varianles de entorno

// rate limiting - protección global
app.use(globalLimiter);

// routes
app.use(indexRoutes);
app.use(groqRoutes);

// middleware
app.use(middleware.notFound);

// Mantenimiento del servidor
// app.use(middleware.serverMantenance);

export default app;
