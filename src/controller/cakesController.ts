import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { ROOT_DIRECTORY } from "../config";
import { Request, Response } from "express";

const prisma = new PrismaClient({ errorFormat: "minimal" });

const createCakes = async (req: Request, res: Response): Promise<any> => {
  try {
    const cake_name: string = req.body.cake_name;
    const cake_price: number = Number(req.body.cake_price);
    const cake_image: string = req.file?.filename || ``;
    const best_before: Date = new Date(req.body.best_before);
    const cake_flavour: string = req.body.cake_flavour;

    const newCakes = await prisma.cakes.create({
      data: {
        cake_name,
        cake_price,
        cake_image,
        best_before,
        cake_flavour,
      },
    });

    return res.status(200).json({
      message: `New cakes has been created`,
      data: newCakes,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const readCakes = async (req: Request, res: Response): Promise<any> => {
  try {
    const search = req.query.search;

    const allCakes = await prisma.cakes.findMany({
      where: {
        OR: [
          {
            cake_name: {
              contains: search?.toString() || "",
            },
          },
        ],
      },
    });

    return res.status(200).json({
      message: `Cakes has been retrieved`,
      data: allCakes,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateCakes = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    const findCakes = await prisma.cakes.findFirst({
      where: { id: Number(id) },
    });

    if (!findCakes) {
      return res.status(200).json({
        message: `Cakes is not found!`,
      });
    }

    if (req.file) {
      let oldFileName = findCakes.cake_image;
      let pathFile = `${ROOT_DIRECTORY}/public/cakes-image/${oldFileName}`;
      let existsFile = fs.existsSync(pathFile);

      if (existsFile && oldFileName !== ``) {
        fs.unlinkSync(pathFile);
      }
    }

    const { cake_name, cake_price, cake_image, best_before, cake_flavour } = req.body;

    const saveCakes = await prisma.cakes.update({
      where: {
        id: Number(id),
      },
      data: {
        cake_name: cake_name ?? findCakes?.cake_name,
        cake_price: cake_price ? Number(cake_price) : findCakes.cake_price,
        cake_image: req.file ? req.file.filename : findCakes.cake_image,
        best_before: best_before ? new Date(best_before) : findCakes.best_before,
        cake_flavour: cake_flavour ? cake_flavour : findCakes.cake_flavour,
      },
    });

    return res.status(200).json({
      message: `Cakes has been updated`,
      data: saveCakes,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteCakes = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    const findCakes = await prisma.cakes.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!findCakes) {
      return res.status(200).json({
        message: `Cakes is not found`,
      });
    }

    // delete the file
    let oldFileName = findCakes.cake_image;
    let pathFile = `${ROOT_DIRECTORY}/public/cakes-image/${oldFileName}`;
    let existsFile = fs.existsSync(pathFile);

    if (existsFile && oldFileName !== ``) {
      fs.unlinkSync(pathFile);
    }

    // delete medicine
    const saveCakes = await prisma.cakes.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      message: `Cakes has been removed`,
      data: saveCakes,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export { createCakes, readCakes, updateCakes, deleteCakes };
