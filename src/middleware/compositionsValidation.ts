import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const detailsCompositionsSchema = Joi.object({
  material_id: Joi.number().required(),
  quantity: Joi.number().required(),
});

const createCompositionsSchema = Joi.object({
  cake_id: Joi.number().required(),
  composition_details: Joi.array().items(detailsCompositionsSchema).min(1).required(),
});

const createValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = createCompositionsSchema.validate(req.body);
  if (validate.error) {
    return res.status(400).json(validate.error.details.map((item) => item.message).join());
  }
  next();
};

const updateSchema = Joi.object({
  cake_id: Joi.number().optional(),
  composition_details: Joi.array().items(detailsCompositionsSchema).min(1).optional(),
});

const updateValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = updateSchema.validate(req.body);
  if (validate.error) {
    return res.status(400).json(validate.error.details.map((item) => item.message).join());
  }
  next();
};

export { createValidation, updateValidation };
