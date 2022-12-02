const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

require("dotenv/config");
app.use(cors());
app.options("*", cors());

const api = process.env.API_URL;

//Routers locate
const productRouter = require("./routers/products");
const usersRouter = require('./routers/users');
const cartsRouter = require('./routers/carts');
const categoriesRouter = require('./routers/categories');

//Middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
try{
    app.use(errorHandler);
}catch(err){
    console.log("------------Reached--------");
    response.status(500).json({ message: "Error in the server" })
}
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

//Routers use
app.use(`${api}/products`, productRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/carts`, cartsRouter);
app.use(`${api}/categories`, categoriesRouter);

// Database connection MongoDB
mongoose.connect(process.env.db_connection_string).then(() => {
    console.log("DB connection success")
}).catch((err) => {
    console.log(err);
})

app.listen(3000, ()=>{
    console.log(api);
    console.log('server is running http://localhost:3000');
})