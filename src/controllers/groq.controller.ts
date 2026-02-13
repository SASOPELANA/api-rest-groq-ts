import groqService from "../services/groq.service.js";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

const getChatResponse = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "El mensaje es requerido." });
    }

    const response = await groqService.chatCompletion(message);
    //console.log(response);

    const messageRes = response.choices[0].message.content;
    //console.log(messageRes);

    return res.status(200).json({ message: messageRes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

const getAudioResponse = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No se ha proporcionado un archivo de audio." });
    }

    const result = await groqService.audioCompletion(
      req.file.buffer,
      req.file.originalname,
    );

    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

const controller = {
  getChatResponse,
  getAudioResponse,
};

export default controller;
