import express from "express";
const router = express.Router()
import auth from "../middleware/auth.js"
import {createProduct, listProducts, deleteProduct, updateProduct, getProduct} from "../controllers/productController.js"
import { getImages } from "../controllers/imagesController.js"

router.get("/getimages", getImages)

router.get("/getone", auth, getProduct)
router.post("/create", auth, createProduct)
router.get("/", listProducts)
router.delete("/", auth, deleteProduct)
router.put("/update", auth, updateProduct)

export default router