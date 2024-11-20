import { NextFunction, Request, Response } from "express";
import Joi, { string } from "joi";

// create a schema for add new medicine
const createSchema = Joi.object({
  supplier_name: Joi.string().required(),
  supplier_address: Joi.string().required(),
  supplier_phone: Joi.string().required(),
});

const createSuppliersValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = createSchema.validate(req.body);
  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details.map((it) => it.message).join(),
    });
  }
  next();
};

const updateSchema = Joi.object({
  supplier_name: Joi.string().optional(),
  supplier_address: Joi.string().optional(),
  supplier_phone: Joi.string().optional(),
});

const updateSuppliersValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = updateSchema.validate(req.body);
  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details.map((it) => it.message).join(),
    });
  }
  next();
};

export { createSuppliersValidation, updateSuppliersValidation };

// jika yang diimpor menggunakan {} maka export juga menggunakan {}, jika tidak juga tidak
