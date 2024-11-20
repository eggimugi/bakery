import { Router } from "express";
import { createCompositions, deleteComposition, readCompositions, updateComposition } from "../controller/compositionsController";
import { createValidation, updateValidation } from "../middleware/compositionsValidation";

const router = Router();
router.post(`/`, [createValidation], createCompositions);
router.get(`/`, readCompositions);
router.put(`/:id`, [updateValidation], updateComposition);
router.delete(`/:id`, deleteComposition);

export default router;
