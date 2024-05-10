import express from "express"
import conectarDB from "./config/db.js"
import routerUsers from "./routes/users.js"
import routerProducts from "./routes/products.js"

import routerCart from "./routes/cart.js"
import routerFavorite from "./routes/favorite.js"
import routerReviews from "./routes/reviews.js"

import cors from "cors"

// crear el servidor
const app = express()

// conectar a la base de datos
conectarDB();

// puerto de la app
const port = process.env.PORT || 4000;

const corsOptions = {
    origin: function(origin, callback){
            callback(null, true) 
    }
}
app.use(cors(corsOptions))

// habilitar leer los valores de un body
app.use( express.json() )

// rutas de la app
app.use("/api/users", routerUsers )
app.use("/api/products", routerProducts )

app.use("/api/cart", routerCart )
app.use("/api/favorite", routerFavorite )
app.use("/api/reviews", routerReviews )

// arrancar app
app.listen(port, "0.0.0.0", () => {})