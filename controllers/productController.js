import Product from "../models/Product.js";
import multer from "multer";
import {string} from "../helpers/index.js";
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import fs from "fs"

export const createProduct = async (req,res) => {
    if(req.user.id !== "657e27e9eda9aad0d5ecf923") return res.status(401).json({msg: "unauthorized"})
    const names = [];

    const multerConfigurations = {
        limits: {fileSize: 1000000 * 5},
        storage: multer.diskStorage({
            destination: (req, file, cb)  => {
                cb(null, "./uploads")
            },
            filename: (req, file, cb) => {
                const name = `${string(20)}.jpeg`
                names.push(`${process.env.BACKEND_URL}/api/products/getimages?img=${name}`)
                cb(null, name);
            }
        })
    }
    
    const upload = multer(multerConfigurations).array("images", 8)

    upload(req, res, async (err) => {
        if(err)return res.json({msg: err});
        // El codigo de abajo funciona y ha sido comprobado decenas de veces em dias diferentes, tal parece que no funciona fuera de esta funcion,
        // asi que si no obtienes el json del form-data intenta recibirlo desde aqui

        const data = JSON.parse(req.body.data);
        const product = new Product(data)

        try {
            names.forEach(name => {
                product.images.push(name)
            });
            await product.save()
            res.status(200).json({msg: "Product created succesfully"})
        } catch (error) {
            return res.status(400).json({msg: error.message})
        }
    });
    
}

export const listProducts = async (req, res) =>{
    try {
        const products = await Product.find()
        return res.status(200).json(products)
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
}

export const deleteProduct = async (req, res) =>{
    if(req.user.id !== "657e27e9eda9aad0d5ecf923") return res.status(401).json({msg: "unauthorized"})
    const _id = req.query.id
    const product = await Product.findById({_id}) 
    try {
        if(product.images.length > 0){
            product.images.forEach(image => {
                try {
                    fs.unlinkSync(`./uploads/${image.split("=")[1]}`);
                } catch (error) { 
                    return res.status(400).json({msg: error.message})
                }
            });
        }
        await Product.findByIdAndDelete({_id})
        res.status(200).json({msg: "Product Deleted Succesfully"})
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
}

export const updateProduct = async (req, res) => {
    if(req.user.id !== "657e27e9eda9aad0d5ecf923") return res.status(401).json({msg: "unauthorized"})
    const _id = req.query.id;
    const names = []; 
 
    const multerConfigurations = {
        limits: {fileSize: 1000000 * 5},
        storage: multer.diskStorage({
            destination: (req, file, cb)  => {
                cb(null, "./uploads")
            },
            filename: (req, file, cb) => {
                const name = `${string(20)}.jpeg`
                names.push(`${process.env.BACKEND_URL}/api/products/getimages?img=${name}`)
                cb(null, name);
            }
        })
    }
    
    const upload = multer(multerConfigurations).array("images", 5)

    upload(req, res, async (err) => {
        if(err)return res.json({msg: err});

        const {name, description, price, discount, stock} = JSON.parse(req.body.data);
        const product = await Product.findById({_id})

        try {

            // se revisa si se mandaron imagenes, si es asi se reemplazan a las que habian antes, si no se quedan las que estaban
            if(names.length > 0){
                
                product.images.forEach(image => {
                    try {
                        fs.unlinkSync(`./uploads/${image.split("=")[1]}`);
                    } catch (error) {
                        return res.status(400).json({msg: error.message})
                    }
                });
                
                product.images = []

                names.forEach(name => {
                    product.images.push(name)
                });

            }

            // se re asignan los valores al producto con el id mandado campo por campo para poder mandar bien las imagenes
            product.name = name
            product.description = description
            product.price = price
            product.discount = discount
            product.stock = stock

            await product.save()
            res.status(200).json({msg: "Product Updated succesfully"})

        } catch (error) {
            return res.status(400).json({msg: error.message})
        }
    });

}