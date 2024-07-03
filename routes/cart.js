import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js"
import {addCart, getCart, removeFromCart, clearCart} from "../controllers/cartController.js"

router.post("/add", auth, addCart)
router.get("/", auth, getCart)
router.post("/remove", auth, removeFromCart)
router.delete("/clear", auth, clearCart)

export default router 