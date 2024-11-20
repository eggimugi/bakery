import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const createUserSchema = Joi.object({
  user_name: Joi.string().required(),
  user_email: Joi.string().required(),
  user_password: Joi.string().required(),
  user_role: Joi.string().valid("Admin", "Cashier").required(),
});

const createUserValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = createUserSchema.validate(req.body);
  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details.map((it) => it.message).join(),
    });
  }
  next();
};

const updateUserSchema = Joi.object({
  user_name: Joi.string().optional(),
  user_email: Joi.string().optional(),
  user_password: Joi.string().optional(),
  user_role: Joi.string().valid("Admin", "Cashier").optional(),
});

const updateUserValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = updateUserSchema.validate(req.body);
  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details.map((it) => it.message).join(),
    });
  }
  next();
};

const authScheme = Joi.object({
  user_email: Joi.string().email().required(),
  user_password: Joi.string().required(),
});

const authValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = authScheme.validate(req.body);
  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details.map((it) => it.message).join(),
    });
  }
  next();
};

export { createUserValidation, updateUserValidation, authValidation };
