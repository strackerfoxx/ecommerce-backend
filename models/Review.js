import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        trim: true,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: null
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    images: [String]
});

const Review = mongoose.model("Review", ReviewSchema);
export default Review