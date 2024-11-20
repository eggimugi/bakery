import { Router } from "express";
import { createCakes, deleteCakes, readCakes, updateCakes } from "../controller/cakesController";
import { uploadCakesImage } from "../middleware/uploadCakesImage";
import { createValidation, updateValidation } from "../middleware/cakesValidation";
import { verifyToken } from "../middleware/authorization";

const router = Router();

router.post(`/`, [verifyToken, uploadCakesImage.single(`images`), createValidation], createCakes);
router.get(`/`, [verifyToken], readCakes);
router.put(`/:id`, [verifyToken, uploadCakesImage.single(`images`), updateValidation], updateCakes);
router.delete(`/:id`, [verifyToken], deleteCakes);

export default router;
