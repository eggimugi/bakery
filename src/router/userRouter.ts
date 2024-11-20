import { Router } from "express";
import { authValidation, createUserValidation, updateUserValidation } from "../middleware/userValidation";
import { authentication, createUser, deleteUser, readUser, updateUser } from "../controller/userController";

const router = Router();

router.post(`/`, [createUserValidation], createUser);
router.get(`/`, readUser);
router.put(`:id`, [updateUserValidation], updateUser);
router.delete(`:id`, deleteUser);
router.post(`/auth`, [authValidation], authentication);

export default router;
