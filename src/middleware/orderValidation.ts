import { NextFunction, Request, Response } from "express";
import Joi, { optional } from "joi";

const detailSchema = Joi.object({
  cake_id: Joi.number().required(),
  qty: Joi.number().required().min(1),
});

const createSchema = Joi.object({
  user_id: Joi.number().required(),
  order_date: Joi.date().required(),
  status: Joi.string().valid("Process", "Delivered").required(),
  detail_order: Joi.array().items(detailSchema).min(1).required(),
});

const createValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = createSchema.validate(req.body);
  if (validate.error) {
    return res.status(400).json(validate.error.details.map((item) => item.message).join());
  }
  next();
};

const updateSchema = Joi.object({
  user_id: Joi.number().optional(),
  order_date: Joi.date().optional(),
  status: Joi.string().valid("Process", "Delivered").optional(),
  detail_order: Joi.array().items(detailSchema).min(1).optional(),
});

const updateValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = updateSchema.validate(req.body);
  if (validate.error) {
    return res.status(400).json(validate.error.details.map((item) => item.message).join());
  }
  next();
};

export { createValidation, updateValidation };
