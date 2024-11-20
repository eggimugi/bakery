import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { ROOT_DIRECTORY } from "../config";
import { Request, Response } from "express";
import { number } from "joi";

const prisma = new PrismaClient({ errorFormat: "minimal" });

type compositionDetailsType = {
  material_id: number;
  quantity: number;
};

const createCompositions = async (req: Request, res: Response): Promise<any> => {
  try {
    const cake_id: number = Number(req.body.cake_id);
    const composition_details: compositionDetailsType[] = req.body.composition_details;

    const arrMaterialsId: number[] = composition_details.map((item) => item.material_id);

    const findMaterial = await prisma.materials.findMany({
      where: {
        id: {
          in: arrMaterialsId,
        },
      },
    });

    const notFoundMaterial = arrMaterialsId.filter((item) => !findMaterial.map((material) => material.id).includes(item));

    if (notFoundMaterial.length > 0) {
      return res.status(400).json({
        message: `There are no materials`,
      });
    }

    let newDetails = [];
    for (let index = 0; index < composition_details.length; index++) {
      const { material_id, quantity } = composition_details[index];
      newDetails.push({
        cake_id,
        material_id,
        quantity,
      });
    }

    await prisma.compositions.createMany({
      data: newDetails,
    });

    return res.status(200).json({
      message: `New compositions have been created.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const readCompositions = async (req: Request, res: Response): Promise<any> => {
  try {
    const allData = await prisma.compositions.findMany({
      include: {
        cake_detail: true,
        material_detail: true,
      },
    });

    type CompositionWithDetails = {
      cake_id: number;
      cake_detail: any;
      materials: {
        material_detail: any;
        quantity: number;
      }[];
    };

    const groupedData = allData.reduce<CompositionWithDetails[]>((result, current) => {
      const { cake_id, cake_detail, material_detail, quantity } = current;

      let existingCake = result.find((item) => item.cake_id === cake_id);

      if (existingCake) {
        existingCake.materials.push({ material_detail, quantity });
      } else {
        result.push({
          cake_id,
          cake_detail,
          materials: [{ material_detail, quantity }],
        });
      }

      return result;
    }, []);

    res.status(200).json({
      message: "Composition has been retrieved",
      data: groupedData,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateComposition = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const findComposition = await prisma.compositions.findMany({
      where: {
        cake_id: Number(id),
      },
    });

    if (!findComposition) {
      return res.status(404).json({
        message: `Composition not found`,
      });
    }

    const cake_id: number = Number(req.body.cake_id) || findComposition[0].cake_id;
    const composition_details: compositionDetailsType[] = req.body.composition_details;

    if (!composition_details || composition_details.length === 0) {
      return res.status(400).json({
        message: `Composition details cannot be empty`,
      });
    }

    await prisma.compositions.deleteMany({
      where: {
        cake_id: Number(id),
      },
    });

    const arrMaterialsId: number[] = composition_details.map((item) => item.material_id);

    const findMaterial = await prisma.materials.findMany({
      where: {
        id: {
          in: arrMaterialsId,
        },
      },
    });

    const notFoundMaterial = arrMaterialsId.filter((item) => !findMaterial.map((material) => material.id).includes(item));

    if (notFoundMaterial.length > 0) {
      return res.status(400).json({
        message: `The following materials are not found: ${notFoundMaterial.join(", ")}`,
      });
    }

    const newDetails = composition_details.map((detail) => ({
      cake_id,
      material_id: detail.material_id,
      quantity: detail.quantity,
    }));

    await prisma.compositions.createMany({
      data: newDetails,
    });

    return res.status(200).json({
      message: `Composition has been successfully updated`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};


const deleteComposition = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    const findComposition = await prisma.compositions.findMany({
      where: {
        cake_id: Number(id),
      },
    });

    if (!findComposition) {
      return res.status(404).json({
        message: `Composition not found`,
      });
    }

    await prisma.compositions.deleteMany({
      where: {
        cake_id: Number(id),
      },
    });

    return res.status(200).json({
      message: `Compositions for cake_id: ${id} have been successfully deleted`
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export { createCompositions, readCompositions, updateComposition, deleteComposition };
