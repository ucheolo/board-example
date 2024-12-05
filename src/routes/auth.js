import express from "express";
import { validateUser } from "../middleware/validation";

const router = express.Router();

router.post("/register", validateUser, register);
router.post("/login", login);

export default router;
