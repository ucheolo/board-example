import express from "express";
import {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
} from "../controllers/postController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validatePost } from "../middleware/validation.js";

const router = express.Router();

router.post("/", authenticateToken, validatePost, createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.put("/:id", authenticateToken, validatePost, updatePost);
router.delete("/:id", authenticateToken, deletePost);

export default router;
