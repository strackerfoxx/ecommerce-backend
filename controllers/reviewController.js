import Review from "../models/Review.js";
import Product from "../models/Product.js";
import multer from "multer";
import {string} from "../helpers/index.js";
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import fs from "fs"

export const createReview = async (req, res) => {
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

        const data = JSON.parse(req.body.data);
        const review = new Review(data)
        const product = await Product.findById(data.product)
        try {
            names.forEach(name => {
                review.images.push(name)
            });
            product.reviews.push(review._id)
            review.owner = req.user.id
            await product.save()
            await review.save()
            res.status(200).json({msg: "Review Uploaded Succesfully"})
        } catch (error) {
            return res.status(400).json({msg: error.message})
        }
    });
}

export const updateReview = async (req, res) => {
    const _id = req.query.id;
    const review = await Review.findById(_id)

    // si el id del usuario no coincide con el id del creador de la review se detiene
    if(req.user.id !== review.owner.toString()) return res.status(401).json({msg: "unauthorized"})
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

        const {title, description, rating} = JSON.parse(req.body.data);

        try {
            // se revisa si se mandaron imagenes, si es asi se reemplazan a las que habian antes, si no se quedan las que estaban
            if(names.length > 0){
                
                review.images.forEach(image => {
                    try {
                        fs.unlinkSync(`./uploads/${image.split("=")[1]}`);
                    } catch (error) {
                        return res.status(400).json({msg: error.message})
                    }
                });
                
                review.images = []

                names.forEach(name => {
                    review.images.push(name)
                });
            }

            // se re asignan los valores a la review con el id mandado campo por campo para poder mandar bien las imagenes
            review.title = title
            review.description = description
            review.rating = rating

            await review.save()
            res.status(200).json({msg: "Review Updated succesfully"})
        } catch (error) {
            return res.status(400).json({msg: error.message})
        }
    });
}