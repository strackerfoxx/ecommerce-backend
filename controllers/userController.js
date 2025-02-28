import User from "../models/User.js";
import Cart from "../models/Cart.js";
import FavoriteList from "../models/FavoriteList.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import ProductInCart from "../models/ProductInCart.js";

import loginMiddleware from "../middleware/login.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv"
dotenv.config({ path: '.env' });

export const newUser = async (req, res, next)  => {

    // verificar si el usuario ya está registrado
    const { email, password } = req.body;
    
    // validar si el usuario ya existe
    const userExist = await User.findOne({ email });
    if(userExist?.auth){
        loginMiddleware(email, password, res, next);
        return;
    }else if(userExist){
        return res.status(400).json({msg: "The User ALREADY Exist"});
    }

    // crear nuevo usuario
    const user = new User(req.body);

    try {
        // hashear el password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // crear usuario
        await user.save();
        await Cart.create({owner: user._id});
        await FavoriteList.create({owner: user._id});

        loginMiddleware(email, password, res, next);

    } catch (error) {
        res.status(401).json({msg: error.message});
    };
};

export const login = async (req, res, next) =>  {
    const { email, password } = req.body;
    const user = await User.findOne({email})
    if(!user) return res.status(404).json({msg: "The User Doesn't Exist"});

    loginMiddleware(user, password, res, next);
}

export const getUser = async (req, res) => {
    const user = await User.findById(req.user.id);

    if(!user) return res.status(404).json({msg: "The User Doesn't Exist"});
    let cart = await Cart.findOne({owner: user._id})
    let favoriteList = await FavoriteList.findOne({owner: user._id})
    const reviews = await Review.find({author: user._id})

    // if the user doesn't have cart and favoriteList create them
    if(!cart){
        await Cart.create({owner: user._id});
        cart = []
    }
    if(!favoriteList){
        await FavoriteList.create({owner: user._id});
        favoriteList = []
    }

    const cartState = {_id: cart._id, products: [], owner: user._id, __v: cart.__v}
    const favoriteListState = {_id: favoriteList._id, products: [], owner: user._id, __v: favoriteList.__v}

    // get products from cart and favoriteList and add them to cartState and favoriteListState 
    if(cart.products.length > 0){
        for (const id of cart.products) {
            const productState = await ProductInCart.findById(id)
            const product = await Product.findById(productState.product)
            cartState.products.push({product, quantity: productState.quantity, color: productState.color, productId: productState._id})
        }
    }
    if(favoriteList.products.length > 0){
        for (const id of favoriteList.products) {
            const product = await Product.findById(id)
            favoriteListState.products.push(product)
        }
    }
    res.status(200).json({cart: cartState, favoriteList: favoriteListState, reviews});
}