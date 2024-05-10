import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js"
import { addFavorite, removeFavorite } from "../controllers/favoriteController.js"

router.post("/add", auth, addFavorite)
router.delete("/remove", auth, removeFavorite)

export default router