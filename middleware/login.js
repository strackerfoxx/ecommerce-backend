import User from "../models/User.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config({ path: '.env' });

const login = async (email, password, res, next) => {
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

export default login