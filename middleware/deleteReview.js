import Review from "../models/Review.js";
import fs from "fs"


export const deleteReviewMiddleware = async (id) => {
    const review = await Review.findById(id)
    if (review.images.length > 0) {
        review.images.forEach(image => {
            try {
                fs.unlinkSync(`./uploads/${image.split("=")[1]}`);
            } catch (error) {
                return console.log({ msg: error.message })
            }
        })
    }
    await Review.findByIdAndDelete(id)
}