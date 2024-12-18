import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient({ errorFormat: "minimal" });

const createSupplies = async (req: Request, res: Response): Promise<any> => {
  try {
    const { supply_date, supplier_id, user_id, detail_supplies } = req.body;

    const materialIds = detail_supplies.map((detail: any) => detail.material_id);

    const foundMaterials = await prisma.materials.findMany({
      where: {
        id: { in: materialIds },
      },
    });

    const foundMaterialIds = foundMaterials.map((material) => material.id);
    const missingMaterials = materialIds.filter((id: number) => !foundMaterialIds.includes(id));

    if (missingMaterials.length > 0) {
      return res.status(404).json({
        success: false,
        message: `Material tidak ditemukan untuk ID: ${missingMaterials.join(", ")}`,
      });
    }

    const newSupplies = await prisma.supplies.create({
      data: {
        supply_date: new Date(supply_date),
        supplier_id,
        user_id,
        detail_supplies: {
          create: detail_supplies.map((detail: any) => ({
            material_id: detail.material_id,
            material_price: detail.material_price,
            qty: detail.qty,
          })),
        },
      },
      include: { detail_supplies: true },
    });

    return res.status(201).json({
      message: "Supplies have been created",
      data: newSupplies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create supplies", error });
  }
};

const readSupplies = async (req: Request, res: Response): Promise<any> => {
  try {
    const supplies = await prisma.supplies.findMany({
      include: {
        detail_supplies: {
          select: {
            supply_id: true,
            material_id: true,
            material_price: true,
            qty: true,
            material_detail: {
              select: {
                material_name: true,
                material_type: true,
              },
            },
          },
        },
        supplier_detail: true,
      },
      orderBy: { supply_date: "desc" },
    });

    return res.status(200).json({
      message: `All orders have been retrieved`,
      data: supplies,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
    });
  }
};

const updateSupplies = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { supply_date, supplier_id, user_id, detail_supplies } = req.body;

    const findSupplies = await prisma.supplies.findMany({
      where: {
        id: Number(id),
      },
      include: {
        detail_supplies: true,
      },
    });

    if (!findSupplies) {
      return res.status(404).json({
        message: `Supplies not found`,
      });
    }

    const updatedSupply = await prisma.supplies.update({
      where: { id: Number(id) },
      data: {
        supply_date: new Date(supply_date),
        supplier_id,
        user_id,
        detail_supplies: {
          deleteMany: {},
          create: detail_supplies.map((detail: any) => ({
            material_id: detail.material_id,
            material_price: detail.material_price,
            qty: detail.qty,
          })),
        },
      },
      include: { detail_supplies: true },
    });

    return res.status(200).json({
      message: `New supplies have been updated`,
      data: updatedSupply,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update supply", error });
  }
};

const deleteSupplies = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const findSupply = await prisma.supplies.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!findSupply) {
      return res.status(400).json({
        message: `Supply is not found`,
      });
    }

    await prisma.detail_supplies.deleteMany({
      where: {
        supply_id: Number(id),
      },
    });

    await prisma.supplies.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      message: `Supply has been removed`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export { createSupplies, readSupplies, updateSupplies, deleteSupplies };
