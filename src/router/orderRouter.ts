import { Router } from "express";
import { createValidation, updateValidation } from "../middleware/orderValidation";
import { createOrder, readOrder, updateOrder } from "../controller/orderController";
import { verifyToken } from "../middleware/authorization";

const router = Router();
router.post(`/`, [verifyToken, createValidation], createOrder);
router.get(`/`, readOrder);
router.put(`/:id`, [updateValidation], updateOrder);

export default router;
