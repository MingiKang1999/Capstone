const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
//const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

require("dotenv/config");
app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

const api = process.env.API_URL;

//Routers locate
const productRouter = require("./routers/products");
const usersRouter = require('./routers/users');
const cartsRouter = require('./routers/carts');
const categoriesRouter = require('./routers/categories');
const discussionsRouter = require('./routers/discussions');

//Middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
//app.use(authJwt());
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
app.use(`${api}/discussions`, discussionsRouter);

__dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) =>
res.sendFile(path.join(__dirname, "/frontend/build/index.html")));

// Database connection MongoDB
mongoose.connect(process.env.db_connection_string).then(() => {
    console.log("DB connection success")
}).catch((err) => {
    console.log(err);
})

// require the paypal Checkout API SDK
const paypal = require("@paypal/checkout-server-sdk")

// client ID an secret are needed to access the API
let clientId = "Af0lPYWdv7lYTtUb3x70dVGzSVxFdY5wucWhLCAmpwv-G-iF5AISJWuolmbsQgT8_XyTDM1oay18MQAE";
let clientSecret = "EB6UmGqBqjUDsMeW_5vqDv7BYMppyfuWhnjQFT2NxpjrWkovJ9oHyYb22QqTtiB9y0RarthyQb4kjBRO";

// Need to create an "environment" with these credentails and give them to the 
// Paypal Checkout API SDK
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let paypalClient = new paypal.core.PayPalHttpClient(environment);

// send back index.html at the root route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

app.post("/create-order", async (req, res) => {

  const request = new paypal.orders.OrdersCreateRequest();

  request.prefer("return=representation")
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "CAD",
          value: 136,
          breakdown: {
            item_total: {
              currency_code: "CAD",
              value: 136,
            },
          },
        },

        items: [
          {name: "Shoes",
           unit_amount: {
             currency_code: "CAD",
             value: 120
           },
          quantity: 1},
          {name: "Socks",
           unit_amount: {
             currency_code: "CAD",
             value: 2
           },
          quantity: 8},          
        ],
      },
    ],
  })

  try {
    const order = await paypalClient.execute(request)
    console.log(order.result);
    res.json({ id: order.result.id })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.listen(process.env.PORT || 5000, ()=>{
    console.log(api);
    console.log('server is running http://localhost:5000');
})