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
    if(!prePass.includes("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z") 
    && passwordSparate.includes("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", ) 
    && passwordSparate.includes("0", "1", "2", "3", "4", "5", "6", "7", "8", "9")){
        return "La contraseña debe tener al menos una mayuscula una minuscula y un numero"
    }
    return "Success"
}
export function genJWT(id){
  return jwt.sign({"id": id}, process.env.JWT_SECRET, {expiresIn: "30d"})
}