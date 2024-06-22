import express from "express";
const router = express.Router();
import { newUser, login, getUser } from "../controllers/userController.js";
import auth from "../middleware/auth.js"

router.post("/newUser", newUser);
router.post("/login", login)
router.get("/getuser", auth, getUser)


export default router