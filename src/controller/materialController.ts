import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient({ errorFormat: "minimal" });

type materialType = "Powder" | "Liquid" | "Solid";

const createMaterials = async (req: Request, res: Response): Promise<any> => {
  try {
    const material_name: string = req.body.material_name;
    const material_price: number = Number(req.body.material_price);
    const material_type: materialType = req.body.material_type;

    const newMaterials = await prisma.materials.create({
      data: {
        material_name,
        material_price,
        material_type,
      },
    });
    return res.status(200).json({
      message: `New materials has been created`,
      data: newMaterials,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const readMaterials = async (req: Request, res: Response): Promise<any> => {
  try {
    const search = req.query.search;

    const allMaterials = await prisma.materials.findMany({
      where: {
        OR: [
          {
            material_name: {
              contains: search?.toString() || "",
            },
          },
        ],
      },
    });

    return res.status(200).json({
      message: `Materials has been retrieved`,
      data: allMaterials,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateMaterials = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    const findMaterials = await prisma.materials.findFirst({
      where: { id: Number(id) },
    });

    if (!findMaterials) {
      return res.status(200).json({
        message: `Materials are not found!`,
      });
    }

    const { material_name, material_price, material_type } = req.body;

    const saveMaterials = await prisma.materials.update({
      where: {
        id: Number(id),
      },
      data: {
        material_name: material_name ?? findMaterials?.material_name,
        material_price: material_price ? Number(material_price) : findMaterials.material_price,
        material_type: material_type ? material_type : findMaterials.material_type,
      },
    });

    return res.status(200).json({
      message: `Materials have been updated`,
      data: saveMaterials,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteMaterials = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    const findMaterials = await prisma.materials.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!findMaterials) {
      return res.status(200).json({
        message: `Materials are not found`,
      });
    }

    // delete materials
    const saveMaterials = await prisma.materials.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      message: `Materials have been removed`,
      data: saveMaterials,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export { createMaterials, readMaterials, updateMaterials, deleteMaterials };
