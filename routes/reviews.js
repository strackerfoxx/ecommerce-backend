import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js"
import { createReview } from "../controllers/reviewController.js";

router.post("/", auth, createReview)

export default router