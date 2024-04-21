import express from "express";
const router = express.Router();
import { newUser, login } from "../controllers/userController.js";
import auth from "../middleware/auth.js"

router.post("/login", login)
router.get("/", auth)
router.post("/newUser", newUser);


export default router