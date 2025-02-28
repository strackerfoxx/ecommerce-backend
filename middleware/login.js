import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config({ path: '.env' });

const login = async (user, password, res, next) => {

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
    res.json({token, _id: user._id, name: user.name})
    return next();
}

export default login