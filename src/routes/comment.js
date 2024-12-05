import express from "express";
import {
    createComment,
    updateComment,
    deleteComment,
} from "../controllers/commentController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateComment } from "../middleware/validation.js";

const router = express.Router();

router.post("/", authenticateToken, validateComment, createComment);
router.put("/", authenticateToken, updateComment);
router.delete("/", authenticateToken, deleteComment);

export default router;
