import Cart from "../models/Cart.js";
import User from "../models/User.js"
import Product from "../models/Product.js"
import ProductInCart from "../models/ProductInCart.js"

export const addCart = async (req, res) => {
    const user = await User.findById(req.user.id);
    const product = req.body.product;
    let cart = await Cart.findOne({owner: user});
    
    // si no existe un carrito con este propietario se crea uno
    if(!cart){
        try {
            cart = new Cart.create({owner: user});
            cart.save();
        } catch (error) {
            res.status(400).json({msg: error.message})
        }
    }

    const pushProduct = (product) => {
        try {
            cart.products.push(product)
            cart.save();
        } catch (error) {
            res.status(400).json({msg: error.message})
        }
    }
    // iterar en el array de productos que es enviado por la peticion 
    const productState = await Product.findById(product.id)
    if(!productState) return res.status(400).json({msg: "product not found"})
    const id = productState._id;
    let productToAdd = await ProductInCart.findOne({product: id})

    // // si este producto no esta actualmente en el carrito se crea y agrega a este
    if(!productToAdd){
        productToAdd = new ProductInCart();
        try {
            productToAdd.product = productState;
            productToAdd.quantity = product.quantity;
            productToAdd.color = product.color;
            await productToAdd.save()
            pushProduct(productToAdd)

            res.status(200).json({msg: "products added to cart successfuly"})
        } catch (error) {
            res.status(400).json({msg: error.message})
        }
    }else{
        // si este producto ya existe en el carrito se actualiza la cantidad
        if(productToAdd.color === product.color){
            try {
                productToAdd.quantity = product.quantity;
                await productToAdd.save()
                pushProduct(productToAdd)

                res.status(200).json({msg: "product quantity updated successfuly"})
            } catch (error) {
                res.status(400).json({msg: error.message})
            }
        }else{
            productToAdd = new ProductInCart();
            try {
                productToAdd.product = productState;
                productToAdd.quantity = product.quantity;
                productToAdd.color = product.color;
                await productToAdd.save()
                pushProduct(productToAdd)
                
                res.status(200).json({msg: "products added to cart successfuly"})
            } catch (error) {
                res.status(400).json({msg: error.message})
            }
        }
    }
}

export const getCart = async (req, res) => {
    const owner = req.user.id
    let cart = await Cart.findOne({owner})
    const products = []
    if(!cart) cart = new Cart({owner})

    try {
        if(cart.products.length > 0){
            for (const id of cart.products) {
                const productState = await ProductInCart.findById(id)
                const product = await Product.findById(productState.product)
                products.push(product)
            }
        }
        res.status(200).json({products})
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
}

export const removeFromCart = async (req, res) => {
    const owner = req.user.id
    const cart = await Cart.findOne({owner})
    await ProductInCart.findByIdAndDelete(req.body.id)
    const cartState = []

    for (const product of cart.products) {
       if(product != req.body.id){
           cartState.push(product)
       }
    }
    try {
        cart.products = cartState;
        await cart.save();
        res.status(200).json({msg: "product removed successfuly"})
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}