import mongoose from "mongoose";
const Schema = mongoose.Schema;

const usuariosSchema = new Schema({
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name : {
        type: String,
        required: true,
        trim: true
    },
    password : {
        type: String,
        required: true,
        trim: true
    }
});

const Usuario = mongoose.model('Usuario', usuariosSchema)
export default Usuario;