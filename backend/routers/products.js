const {Product} = require("../models/product")
var mongoose = require('mongoose');
const multer = require("multer");

const express = require("express");
const { Category } = require("../models/category");

const router = express.Router();

const FILE_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg"
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error("Invalid image type");

        if(isValid){
            uploadError = null
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.replace(" ", "-");
      const extensions = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extensions}`)
    }
  })
  
  const upload = multer({ storage: storage })

router.get("/:productId", async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.productId)) {
        const productList = await Product.findById(req.params.productId).populate("category");
    
        if(!productList) {
            res.status(500).json({success: false})
        }
        
        res.send(productList);
    }else{
        res.status(404).json({success: false, message: "The searched product was not found"});
      }
})

router.get(`/`, async (req, res) => {
    let filter = {};
    if(req.query.categories){
        filter = {category: req.query.categories.split(",")}
    }

    const productList = await Product.find(filter).select("title art price description rating reviewedNumber _id available");
    
    if(!productList) {
        res.status(500).json({success: false})
    }
    
    res.send(productList);
})

router.post(`/`, upload.single("art"), async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.body.category)) {
        const category = await Category.findById(req.body.category);
        if(!category){
            return res.status(400).send("Not a valid Category");
        }
        const file = req.file;
        if(!file){
            return res.status(400).send("The product image is missing");
        }
        const fileName = req.file.filename
        const path = `${req.protocol}://${req.get("host")}/public/uploads/`;

        const product = new Product({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
            art: `${path}${fileName}`,
            available: req.body.available,
            rating: req.body.rating,
            reviewedNumber: req.body.reviewedNumber,
            featured: req.body.featured
        });
        product.save().then((createdProduct => {
            res.status(201).json(createdProduct)
        })).catch((err) => {
            res.status(500).json({
                error: err,
                success: false
            })
        })
    
        if(!product){
            return res.status(500).send("The product was failed to be created");
        }
    }else{
        res.status(404).json({success: false, message: "The searched category was not found"});
      }
})

router.put("/:productId", async (req, res) =>{
    if (mongoose.Types.ObjectId.isValid(req.params.productId)) {
        if (mongoose.Types.ObjectId.isValid(req.body.category)) {
            const category = await Category.findById(req.body.category);
            if(!category){
                return res.status(400).send("Not a valid Category");
            }

            const product = await Product.findByIdAndUpdate(
                req.params.productId,
                {
                    title: req.body.title,
                    price: req.body.price,
                    description: req.body.description,
                    category: req.body.category,
                    art: req.body.art,
                    available: req.body.available,
                    rating: req.body.rating,
                    reviewedNumber: req.body.reviewedNumber,
                    featured: req.body.featured
                },
                { new: true}
            )
        
            if (!product){
                return res.status(404).send("The update of Product was not successful");
            }
        
            res.send(product);
        }else{
            res.status(404).json({success: false, message: "The searched product was not found"});
        }
    }
})

router.delete("/:productId", async (req, res) => {
    Product.findByIdAndRemove(req.params.productId).then(product => {
        if(product){
            return res.status(200).json({success: true, message: "Product has been deleted"});
        }else{
            return res.status(404).json({success: false, message: "The searched product was not found"});
        }
    }).catch(error=>{
        return res.status(400).json({success: false, error: error});
    })
})

router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments();
    
    if(!productCount) {
        res.status(500).json({success: false})
    }
    
    res.send({
        count: productCount
    });
})

router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const productFeatured = await Product.find({isFeatured: true}).limit(+count);
    
    if(!productFeatured) {
        res.status(500).json({success: false})
    }
    
    res.send(productFeatured);
})

module.exports = router;