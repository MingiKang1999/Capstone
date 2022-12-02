const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');

router.get("/:categoryId", async(req, res) =>{
    if (mongoose.Types.ObjectId.isValid(req.params.categoryId)) {
        const category = await Category.findById(req.params.categoryId);

        if(!category) {
            res.status(500).json({message: "Could not find the Catrgory"});
        }
    
        res.status(200).send(category);
      }else{
        res.status(404).json({success: false, message: "The searched category was not found"});
      }
})

router.get(`/`, async (req, res) =>{
    const categoryList = await Category.find();

    if(!categoryList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(categoryList);
})

router.post("/", async (req, res) =>{
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save();

    if (!category){
        return res.status(404).send("The creation of Category was not successful");
    }

    res.send(category);
})

router.delete("/:categoryId", async (req, res) => {
    Category.findByIdAndRemove(req.params.categoryId).then(category => {
        if(category){
            return res.status(200).json({success: true, message: "Category has been deleted"});
        }else{
            return res.status(404).json({success: false, message: "The searched category was not found"});
        }
    }).catch(error=>{
        return res.status(400).json({success: false, error: error});
    })
})

router.put("/:categoryId", async (req, res) =>{
    if (mongoose.Types.ObjectId.isValid(req.params.categoryId)) {
        const category = await Category.findByIdAndUpdate(
            req.params.categoryId,
            {
                name: req.body.name,
                icon: req.body.icon,
                color: req.body.color
            },
            { new: true}
        )
    
        if (!category){
            return res.status(404).send("The update of Category was not successful");
        }
    
        res.send(category);
    }else{
        res.status(404).json({success: false, message: "The searched category was not found"});
    }
})

module.exports =router;