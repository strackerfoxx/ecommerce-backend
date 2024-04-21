



import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    const authHeader = req.get("Authorization");
    if(!authHeader) return res.status(401).json({msg: "There is NOT a Token"});

    //obtener header
    const token = authHeader.split(" ")[1]
    try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        req.user = user
    } catch (error) {
        return res.status(401).json({msg: error.message});
    };
    return next();
}
export default auth;