import { Request, Response, NextFunction } from "express";

const notFount = (_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    error: {
      message: "Not found",
    },
  });
};

const serverMantenance = (
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
  notFount,
  serverMantenance,
};

export default middleware;
