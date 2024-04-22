import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js"
import { createReview, updateReview } from "../controllers/reviewController.js";

router.post("/", auth, createReview)
router.put("/update", auth, updateReview)

export default router