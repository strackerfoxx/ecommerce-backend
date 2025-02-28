import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js"
import { handleFavorite } from "../controllers/favoriteController.js"

router.post("/", auth, handleFavorite)

export default router