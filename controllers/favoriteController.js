import Product from "../models/Product.js";
import FavoriteList from "../models/FavoriteList.js";
import User from "../models/User.js";

export const addFavorite = async (req, res) => {
    if(!req.user) return res.status(401).json({msg: "unauthorized"});
    if(!req.body.products) return res.status(401).json({msg: "no products"});

    const user = await User.findById(req.user.id)
    let favoriteList = await FavoriteList.findOne({owner: user._id})
    
    if(!favoriteList) favoriteList = new FavoriteList({owner: user._id})
        

    if(!favoriteList.products.includes(req.body.products.id)){
        const products = []
        try {
            const product = await Product.findById(req.body.products.id)
            products.push(product)
            favoriteList.products = products
            await favoriteList.save()
            res.status(200).json({msg: "product added to favorite"})
        } catch (error) {
            res.status(401).json({msg: error.message});
        }
    }else{
        const products = []
        try {
            for (const productState of favoriteList.products) {
                if(productState.toString() !== req.body.products.id){
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

export const removeFavorite = async (req, res) => {
    if(!req.user) return res.status(401).json({msg: "unauthorized"});
    if(!req.body.products) return res.status(401).json({msg: "no products"});

    const favoriteList = await FavoriteList.findOne({owner: req.user.id})
    if(!favoriteList) return res.status(401).json({msg: "no favortie list"});

    const products = []
    for(const produtctState of favoriteList.products){
        if(produtctState !== req.body.products){
            products.push(produtctState)
        }
    }

    favoriteList.products = products
    await favoriteList.save()

    res.status(200).json({msg: "product removed from favorite"})
}