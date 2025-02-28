import Review from "../models/Review.js";
import Product from "../models/Product.js";
import multer from "multer";
import { string } from "../helpers/index.js";
import {deleteReviewMiddleware} from "../middleware/deleteReview.js";
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import fs from "fs"

export const createReview = async (req, res) => {
    const names = []; 

    const multerConfigurations = {
        limits: { fileSize: 1000000 * 5 },
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, "./public")
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
        if (err) return res.json({ msg: err });

        const data = JSON.parse(req.body.data);
        const review = new Review(data)
        const product = await Product.findById(data.product)
        if (!product) return res.status(404).json({ msg: "The Product Doesn't Exist" })
        try {
            names.forEach(name => {
                review.images.push(name)
            });
            product.reviews.push(review._id)
            review.author = req.user.id
            await product.save()
            await review.save()
            res.status(200).json({ msg: "Review Uploaded Succesfully" })
        } catch (error) {
            return res.status(400).json({ msg: error.message })
        }
    });
}

export const updateReview = async (req, res) => {
    const review = await Review.findById(req.query.id)
    if (!review) return res.status(404).json({ msg: "The Review Doesn't Exist" })

    // si el id del usuario no coincide con el id del creador de la review se detiene
    if (req.user.id !== review.author.toString()) return res.status(401).json({ msg: "unauthorized" })
    const names = [];

    const multerConfigurations = {
        limits: { fileSize: 1000000 * 5 },
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, "./public")
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
        if (err) return res.json({ msg: err });

        const { title, description, rating } = JSON.parse(req.body.data);

        try {
            // se revisa si se mandaron imagenes, si es asi se reemplazan a las que habian antes, si no se quedan las que estaban
            if (names.length > 0) {

                review.images.forEach(image => {
                    try {
                        fs.unlinkSync(`./public/${image.split("=")[1]}`);
                    } catch (error) {
                        return res.status(400).json({ msg: error.message })
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
            review.rating = rating;

            await review.save();
            res.status(200).json({ msg: "Review Updated succesfully" });
        } catch (error) {
            return res.status(400).json({ msg: error.message });
        };
    });
};

export const listReviews = async (req, res) => {
    const product = await Product.findById(req.query.id);
    const reviews = [];
    try {
        for (const reviewState of product.reviews) {
            const review = await Review.findById(reviewState);
            reviews.push(review);
        };
        res.status(200).json({ reviews });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    };
};

export const deleteReview = async (req, res) => {
    const review = await Review.findById(req.query.id)
    if (!review) return res.status(404).json({ msg: "The Review Doesn't Exist" })

    const product = await Product.findById(review.product)
    const reviews = [];
    if (review.author.toString() !== req.user.id) return res.status(401).json({ msg: "unauthorized" })
    try {
        product.reviews.map(reviewState => {
            if(reviewState.toString() !== review._id.toString()){
                reviews.push(reviewState)
            }
        })
        product.reviews = reviews;
        await product.save();
        await deleteReviewMiddleware(req.query.id)
        res.status(200).json({ msg: "Review Deleted Succesfully" })
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
    
}