import { Router } from "express";
import { createMaterialValidation, updateMaterialValidation } from "../middleware/materialValidation";
import { createMaterials, deleteMaterials, readMaterials, updateMaterials } from "../controller/materialController";
import { verifyToken } from "../middleware/authorization";

const router = Router();

router.post(`/`, [verifyToken, createMaterialValidation], createMaterials);
router.get(`/`, [verifyToken], readMaterials);
router.put(`/:id`, [verifyToken, updateMaterialValidation], updateMaterials);
router.delete(`/:id`, [verifyToken], deleteMaterials);

export default router;
