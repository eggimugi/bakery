import { Router } from "express";
import { createValidation, updateValidation } from "../middleware/orderValidation";
import { createOrder, deleteOrder, readOrder, updateOrder } from "../controller/orderController";
import { verifyToken } from "../middleware/authorization";

const router = Router();
router.post(`/`, [createValidation], createOrder);
router.get(`/`, readOrder);
router.put(`/:id`, [updateValidation], updateOrder);
router.delete(`/:id`, deleteOrder);
export default router;
