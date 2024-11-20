import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient({ errorFormat: "minimal" });

const createSuppliers = async (req: Request, res: Response): Promise<any> => {
  try {
    const supplier_name: string = req.body.supplier_name;
    const supplier_address: string = req.body.supplier_address;
    const supplier_phone: string = req.body.supplier_phone;

    const newSuppliers = await prisma.suppliers.create({
      data: {
        supplier_name,
        supplier_address,
        supplier_phone,
      },
    });
    return res.status(200).json({
      message: `New supplier has been created`,
      data: newSuppliers,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const readSuppliers = async (req: Request, res: Response): Promise<any> => {
  try {
    const search = req.query.search;

    const allSuppliers = await prisma.suppliers.findMany({
      where: {
        OR: [
          {
            supplier_name: {
              contains: search?.toString() || "",
            },
          },
        ],
      },
    });

    return res.status(200).json({
      message: `Supplier has been retrieved`,
      data: allSuppliers,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateSuppliers = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    const findSuppliers = await prisma.suppliers.findFirst({
      where: { id: Number(id) },
    });

    if (!findSuppliers) {
      return res.status(200).json({
        message: `Suppliers are not found!`,
      });
    }

    const { supplier_name, supplier_address, supplier_phone } = req.body;

    const saveSuppliers = await prisma.suppliers.update({
      where: {
        id: Number(id),
      },
      data: {
        supplier_name: supplier_name ?? findSuppliers?.supplier_name,
        supplier_address: supplier_address ?? findSuppliers?.supplier_address,
        supplier_phone: supplier_phone ?? findSuppliers?.supplier_phone,
      },
    });

    return res.status(200).json({
      message: `Suppliers have been updated`,
      data: saveSuppliers,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteSuppliers = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    const findSuppliers = await prisma.suppliers.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!findSuppliers) {
      return res.status(200).json({
        message: `Suppliers are not found`,
      });
    }

    // delete materials
    const saveSuppliers = await prisma.suppliers.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      message: `Suppliers have been removed`,
      data: saveSuppliers,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export { createSuppliers, readSuppliers, updateSuppliers, deleteSuppliers };
