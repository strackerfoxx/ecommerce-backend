import User from "../models/User.js";
import Cart from "../models/Cart.js";
import FavoriteList from "../models/FavoriteList.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config({ path: '.env' });

export const newUser = async (req, res)  => {

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

        res.json({msg: "User Created Successfully"});
    } catch (error) {
        res.status(401).json({msg: error.message});
    };
};

export const login = async (req, res, next) =>  {

    // buscar el usuario para ver si está registrado
    const { email, password } = req.body;
    const user = await User.findOne({email})
    if(!user) return res.status(404).json({msg: "The User Doesn't Exist"});

    // verificar password y autenticar usuario
    if(!bcrypt.compareSync(password, user.password))return res.status(401).json({msg: "The Password is Incorrect"});

    // Crear JWT
    const token = jwt.sign({
        "id": user._id,
        "name": user.name,
        "email": user.email,
    }, process.env.SECRET_KEY, {
        expiresIn: "90d"
    });
    res.json({token})
    return next();
}