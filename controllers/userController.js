import User from "../models/User.js";
import Cart from "../models/Cart.js";
import FavoriteList from "../models/FavoriteList.js";

import loginMiddleware from "../middleware/login.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv"
dotenv.config({ path: '.env' });

export const newUser = async (req, res, next)  => {

    // verificar si el usuario ya está registrado
    const { email, password } = req.body;
    
    // validar si el usuario ya existe
    if(await User.findOne({ email })) return res.status(400).json({msg: "The User ALREADY Exist"});

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
    loginMiddleware(email, password, res, next);
}