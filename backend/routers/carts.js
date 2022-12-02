const {Cart} = require("../models/cart");
const express = require("express");
const { CartItem } = require("../models/cartItem");
const router = express.Router();
var mongoose = require('mongoose');

router.get(`/`, async (req, res) =>{
    const cartList = await Cart.find().populate("user", "firstName lastName").populate({path: "cartItems", populate: "product"}).sort({"dateOrdered": -1});

    if(!cartList) {
        res.status(500).json({success: false})
    } 
    res.send(cartList);
})

router.get("/get/userorders/:userId", async (req, res) =>{
    const userCartList = await Cart.find({user: req.params.userId}).populate("user", "firstName lastName").populate({path: "cartItems", populate: {path: "product", populate: "category"}}).sort({"dateOrdered": -1});

    if(!userCartList) {
        res.status(500).json({success: false})
    } 
    res.send(userCartList);
})

router.get("/:cartId", async (req, res) =>{
    if (mongoose.Types.ObjectId.isValid(req.params.cartId)) {
        const cart = await Cart.findById(req.params.cartId).populate("user", "firstName lastName").populate({path: "cartItems", populate: {path: "product", populate: "category"}});

        if(!cart) {
            res.status(500).json({success: false})
        } 
        res.send(cart);
    }else{
        res.status(404).json({success: false, message: "The searched cart was not found"});
      }
})

router.post("/", async (req, res) =>{
    const cartItemsIds = Promise.all(req.body.cartItems.map(async (cartItem) =>{
        let newCartItem = new CartItem({
            quantity: cartItem.quantity,
            product: cartItem.product
        })

        newCartItem = await newCartItem.save();

        return newCartItem._id;
    }))

    const cartItemsIdsfixed =  await cartItemsIds;

    const totalPrices = await Promise.all(cartItemsIdsfixed.map(async (cartItemId)=>{
        const cartItem = await CartItem.findById(cartItemId).populate('product', 'price');
        const totalPrice = cartItem.product.price * cartItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b) => a +b , 0);

    let cart = new Cart({
        cartItems: cartItemsIdsfixed,
        shippingAddress: req.body.shippingAddress,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    cart = await cart.save();

    if (!cart){
        return res.status(404).send("The creation of cart was not successful");
    }

    res.send(cart);
})

router.put("/:cartId", async (req, res) =>{
    if (mongoose.Types.ObjectId.isValid(req.params.cartId)) {
        const cart = await Cart.findByIdAndUpdate(
            req.params.cartId,
            {
                status: req.body.status
            },
            { new: true}
        )
    
        if (!cart){
            return res.status(404).send("The update of Order was not successful");
        }
    
        res.send(cart);
    }else{
        res.status(404).json({success: false, message: "The searched order was not found"});
    }
})

router.get("/get/count", async (req, res) => {
    const cartCount = await Cart.countDocuments();
    
    if(!cartCount) {
        res.status(500).json({success: false})
    }
    
    res.send({
        count: cartCount
    });
})

router.delete("/:cartId", async (req, res) => {
    Cart.findByIdAndRemove(req.params.cartId).then(async cart => {
        if(cart){
            await cart.cartItems.map(async cartItem =>{
                await CartItem.findByIdAndRemove(cartItem)
            })
            return res.status(200).json({success: true, message: "Cart has been deleted"});
        }else{
            return res.status(404).json({success: false, message: "The searched cart was not found"});
        }
    }).catch(error=>{
        return res.status(400).json({success: false, error: error});
    })
})

router.get("/get/totalsales", async (req, res) => {
    const totalSales = await Cart.aggregate([
        { $group: { _id: null, totalsales : { $sum : "$totalPrice"}}}
    ])

    if(!totalSales){
        return res.status(400).send("Total sales cannot be generated")
    }else{
        res.send({totalSales: totalSales.pop().totalsales})
    }
})

module.exports = router;