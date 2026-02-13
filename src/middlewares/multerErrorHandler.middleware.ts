import multer from "multer";
import { Request, Response, NextFunction } from "express";

const multerErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof multer.MulterError) {
    // Errores específicos de Multer (ej. FILE_TOO_LARGE)
    return res.status(400).json({
      message: "Error en la subida del archivo de audio",
      details: err.message,
    });
  } else if (err) {
    // Errores lanzados desde fileFilter (como tu "Formato de video MP4 no soportado")
    // O cualquier otro error desconocido que llegue aquí
    return res.status(400).json({
      message: "Error de procesamiento de archivo",
      details: err.message,
    });
  }
  // Si no hay error, pasa al siguiente middleware
  next();
};

export default multerErrorHandler;
