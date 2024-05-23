import jwt from "jsonwebtoken"

export function string(longitud) {
    let caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.';
    let resultado = '';
    for (let i = 0; i < longitud; i++) {
      resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return resultado;
  }
export function validatePass(password){
    const prePass = password.split("")
    if(!prePass.split("").some(char => char.match(/[A-Z]/)) || !prePass.split("").some(char => char.match(/[a-z]/)) || !prePass.split("").some(char => char.match(/[0-9]/))){
      return "the password must contain at least one uppercase letter, one lowercase letter and one number"
    }
    
    return "Success"
}
export function genJWT(id){
  return jwt.sign({"id": id}, process.env.JWT_SECRET, {expiresIn: "30d"})
}