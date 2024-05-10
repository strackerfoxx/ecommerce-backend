import mongoose from "mongoose";
const Schema = mongoose.Schema

const CartSchema = new Schema({
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductInCart",
            default: null
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        required: true
    },
});

const Cart = mongoose.model("Cart", CartSchema);
export default Cart