import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import indexRoutes from "./routes/index.routes.js";
import groqRoutes from "../src/routes/groq.routes.js";
import middleware from "../src/middlewares/notFount.middleware.js";
import { globalLimiter } from "../src/middlewares/rateLimiter.middleware.js";

const app = express();

// settings
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// rate limiting - protección global
app.use(globalLimiter);

// routes
app.use(indexRoutes);
app.use(groqRoutes);

// middleware
app.use(middleware.notFount);

export default app;
