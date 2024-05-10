import mongoone from "mongoose";
const Schema = mongoone.Schema;

const FavoriteSchema = new Schema({
    products: [{
        type: mongoone.Schema.Types.ObjectId,
        ref: "Product",
        default: null
    }],
    owner: {
        type: mongoone.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
});

const FavoriteList = mongoone.model("FavoriteList", FavoriteSchema);
export default FavoriteList