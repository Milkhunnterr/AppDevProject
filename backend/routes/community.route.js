import express from "express";
import { 
    createPost, getAllPosts, getPostById, updatePost, 
    likePost, commentOnPost, deleteComment, deletePost 
} from "../controllers/community.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔓 ไม่ต้องล็อกอิน (ส่องฟีดได้)
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// 🔒 ต้องล็อกอิน (ถึงจะตั้งกระทู้ ไลค์ คอมเมนต์ได้)
router.post("/", verifyToken, createPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

router.put("/:id/like", verifyToken, likePost);
router.post("/:id/comment", verifyToken, commentOnPost);
router.delete("/:postId/comment/:commentId", verifyToken, deleteComment);

export default router;