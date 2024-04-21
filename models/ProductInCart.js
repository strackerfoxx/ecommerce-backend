import mongoose from "mongoose"
const Schema = mongoose.Schema;

const ProductInCartSchema = new Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: null
    },
    quantity: {
        type: Number,
        trim: true,
        required: true
    },
})

const ProductInCart = mongoose.model("ProductInCart", ProductInCartSchema);
export default ProductInCart;