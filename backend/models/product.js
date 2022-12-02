const mongoose = require("mongoose");
const { Category } = require("./category");

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true},
    postedDate: { type: Date, default: Date.now },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    description: {
        type: String,
        required: true},
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    art: {
        type: String,
        required: true,
        default: ""},
    rating: {
        type: Number,
        default: 0
    },
    reviewedNumber: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    available: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    }
})

productSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

productSchema.set("toJSON", {
    virtuals: true
});

exports.Product = mongoose.model("Product", productSchema);