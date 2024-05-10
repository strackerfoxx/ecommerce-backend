import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    discount: {
        type: Number,
        trim: true,
        required: true
    },
    stock: {
        type: Number,
        trim: true,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    visible: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
            default: null
        }
    ],
    images: [String]
});

const Product = mongoose.model("Product", ProductsSchema)
export default Product