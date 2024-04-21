import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js"
import {addCart, getCart, removeFromCart} from "../controllers/cartController.js"

router.post("/add", auth, addCart)
router.get("/", auth, getCart)
router.delete("/delete", auth, removeFromCart)

export default router 