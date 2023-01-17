const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
var mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");

router.get("/:userId", async(req, res) =>{
    if (mongoose.Types.ObjectId.isValid(req.params.userId)) {
        const user = await User.findById(req.params.userId).select("-hashedPassword");

        if(!user) {
            res.status(500).json({message: "Could not find the Catrgory"});
        }
    
        res.status(200).send(user);
      }else{
        res.status(404).json({success: false, message: "The searched category was not found"});
      }
})

router.get(`/`, async (req, res) =>{
    const userList = await User.find().select("firstName lastName userName");

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
})

router.post("/", async (req, res) =>{
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        hashedPassword: bcrypt.hashSync(req.body.password, 5),
        address: req.body.address,
        adminCheck: req.body.adminCheck
    })
    user = await user.save();

    if (!user){
        return res.status(404).send("The creation of User was not successful");
    }

    res.send(user);
})

router.post("/login", expressAsyncHandler (async(req, res) => {
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.secret;
    if(!user){
        return res.status(400).send("This user does not exist");
    }else{
        if(user && bcrypt.compareSync(req.body.password, user.hashedPassword)){
            const token = jwt.sign(
                {
                    userId: user.id,
                    adminCheck: user.adminCheck
                },
                secret,
                {expiresIn: "1d"}
            )

            res.send({user: user.email, token: token});
            return;
        }else{
            res.status(400).send("Incorrect Password Entered");
        }
    }
}))

router.post("/register", async (req, res) =>{
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        hashedPassword: bcrypt.hashSync(req.body.password, 5),
        address: req.body.address,
        adminCheck: req.body.adminCheck
    })
    user = await user.save();

    if (!user){
        return res.status(404).send("The creation of User was not successful");
    }

    res.send(user);
})

router.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments();
    
    if(!userCount) {
        res.status(500).json({success: false})
    }
    
    res.send({
        count: userCount
    });
})

router.delete("/:userId", async (req, res) => {
    User.findByIdAndRemove(req.params.userId).then(user => {
        if(user){
            return res.status(200).json({success: true, message: "User has been deleted"});
        }else{
            return res.status(404).json({success: false, message: "The searched user was not found"});
        }
    }).catch(error=>{
        return res.status(400).json({success: false, error: error});
    })
})

module.exports = router;