import { body } from "express-validator";

const rules = [
  body("message")
    .notEmpty()
    .withMessage("El campo 'message' no puede estar vacío")
    .exists()
    .withMessage("El campo 'message' es requerido")
    .isString()
    .withMessage("El campo 'message' debe ser una cadena de texto"),
];

const validate = {
  rules,
};

export default validate;
