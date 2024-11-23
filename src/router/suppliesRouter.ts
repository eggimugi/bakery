import { Router } from "express";
import { createSupplies, deleteSupplies, readSupplies, updateSupplies } from "../controller/suppliesController";

const router = Router();
router.post(`/`, createSupplies);
router.get(`/`, readSupplies);
router.put(`/:id`, updateSupplies);
router.delete(`/:id`, deleteSupplies);

export default router;
