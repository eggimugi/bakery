import { NextFunction, Request, Response } from "express";
import Joi, { string } from "joi";
import path from "path";
import fs from "fs";
import { ROOT_DIRECTORY } from "../config";

// create a schema for add new medicine
const createSchema = Joi.object({
  cake_name: Joi.string().required(),
  cake_price: Joi.number().min(1).required(),
  best_before: Joi.date().required(),
  cake_flavour: Joi.string().required(),
});

const createValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = createSchema.validate(req.body);
  if (validate.error) {
    // delete current uploaded file
    let fileName: string = req.file?.filename || ``;
    let pathFile = path.join(ROOT_DIRECTORY, "public", "cakes-image", fileName);

    // check is file exists
    let fileExists = fs.existsSync(pathFile);
    // apakah ada file yang akan dihapus

    if (fileExists && fileName !== ``) {
      // delete file
      fs.unlinkSync(pathFile);
    }

    return res.status(400).json({
      message: validate.error.details.map((it) => it.message).join(),
    });
  }
  next();
};

// create a schema for change medicine
const updateSchema = Joi.object({
  cake_name: Joi.string().optional(),
  cake_price: Joi.number().min(1).optional(),
  best_before: Joi.date().optional(),
  cake_flavour: Joi.string().optional(),
});

const updateValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = updateSchema.validate(req.body);
  if (validate.error) {
    // delete current uploaded file
    let fileName: string = req.file?.filename || ``;
    let pathFile = path.join(ROOT_DIRECTORY, "public", "cakes-image", fileName);

    // check is file exists
    let fileExists = fs.existsSync(pathFile);
    // apakah adal file yang akan dihapus

    if (fileExists && fileName !== ``) {
      // delete file
      fs.unlinkSync(pathFile);
    }

    return res.status(400).json({
      message: validate.error.details.map((it) => it.message).join(),
    });
  }
  next();
};

export { createValidation, updateValidation };

// jika yang diimpor menggunakan {} maka export juga menggunakan {}, jika tidak juga tidak
