import { Router } from "express";
import { createSuppliersValidation, updateSuppliersValidation } from "../middleware/suppliersValidation";
import { createSuppliers, deleteSuppliers, readSuppliers, updateSuppliers } from "../controller/suppliersController";
import { verifyToken } from "../middleware/authorization";

const router = Router();
router.post(`/`, [verifyToken, createSuppliersValidation], createSuppliers);
router.get(`/`, [verifyToken], readSuppliers);
router.put(`/:id`, [verifyToken, updateSuppliersValidation], updateSuppliers);
router.delete(`/:id`, [verifyToken], deleteSuppliers);

export default router;
