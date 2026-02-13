import { Request, Response, NextFunction } from "express";

const notFound = (_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    error: {
      message: "Not found",
    },
  });
};

const serverMaintenance = (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(503).json({
    error: {
      message: "Servidor en mantenimiento",
    },
  });
};

const middleware = {
  notFound,
  serverMaintenance,
};

export default middleware;
