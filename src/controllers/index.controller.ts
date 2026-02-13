import service from "../services/index.service.js";
import { Request, Response } from "express";

const index = (_req: Request, res: Response) => {
  res.json(service.index);
};

const controller = {
  index,
};

export default controller;
