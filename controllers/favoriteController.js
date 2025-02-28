import Product from "../models/Product.js";
import FavoriteList from "../models/FavoriteList.js";
import User from "../models/User.js";

export const handleFavorite = async (req, res) => {
    if(!req.user) return res.status(401).json({msg: "unauthorized"});
    if(!req.body.product) return res.status(401).json({msg: "no product sent"});

    const user = await User.findById(req.user.id)
    let favoriteList = await FavoriteList.findOne({owner: user._id})
    
    if(!favoriteList) favoriteList = new FavoriteList({owner: user._id})
        

    if(!favoriteList.products.includes(req.body.product)){
        try {
            const product = await Product.findById(req.body.product)
            favoriteList.products.push(product)
            await favoriteList.save()
            res.status(200).json({msg: "product added to favorite"})
        } catch (error) {
            res.status(401).json({msg: error.message});
        }
    }else{
        const products = []
        try {
            for (const productState of favoriteList.products) {
                if(productState.toString() !== req.body.product){
                    products.push(productState);
                }
            }
            favoriteList.products = products
            await favoriteList.save()
            res.status(200).json({msg: "product removed to favorite"})
        } catch (error) {
            res.status(401).json({msg: error.message});
        }
    }

}