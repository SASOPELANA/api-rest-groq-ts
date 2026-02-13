import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const allowedTypes = [
      "audio/mpeg",
      "audio/ogg",
      "audio/wav",
      "audio/webm",
      "audio/flac",
      "audio/x-m4a",
    ];

    if (file.mimetype === "video/mp4") {
      return cb(
        new Error(
          "Formato de video MP4 no soportado. Sube solo archivos de audio.",
        ),
      );
    }

    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error("Formato de audio no soportado. Usa mp3, ogg, wav o webm."),
    );
  },
});
