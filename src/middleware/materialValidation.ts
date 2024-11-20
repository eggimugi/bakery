import { NextFunction, Request, Response } from "express";
import Joi, { string } from "joi";

// create a schema for add new medicine
const createSchema = Joi.object({
  material_name: Joi.string().required(),
  material_price: Joi.number().min(1).required(),
  material_type: Joi.string().valid("Powder", "Liquid", "Solid").required(),
});

const createMaterialValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = createSchema.validate(req.body);
  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details.map((it) => it.message).join(),
    });
  }
  next();
};

// create a schema for change medicine
const updateSchema = Joi.object({
  material_name: Joi.string().optional(),
  material_price: Joi.number().min(1).optional(),
  material_type: Joi.string().valid("Powder", "Liquid", "Solid").optional(),
});

const updateMaterialValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = updateSchema.validate(req.body);
  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details.map((it) => it.message).join(),
    });
  }
  next();
};

export { createMaterialValidation, updateMaterialValidation };

// jika yang diimpor menggunakan {} maka export juga menggunakan {}, jika tidak juga tidak
