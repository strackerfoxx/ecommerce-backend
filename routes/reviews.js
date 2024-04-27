import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js"
import { createReview, updateReview, listReviews, deleteReview } from "../controllers/reviewController.js";

router.get("/", auth, listReviews)
router.post("/", auth, createReview)
router.put("/update", auth, updateReview)
router.delete("/delete", auth, deleteReview)

export default router