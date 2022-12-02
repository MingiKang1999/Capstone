const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    cartItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CartItem',
        required: true
    }],
    shippingAddress: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "Pending",
    },
    totalPrice: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    dateOrdered: {
        type: Date,
        default: Date.now,
    }
});

cartSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

cartSchema.set("toJSON", {
    virtuals: true
});

exports.Cart = mongoose.model('Cart', cartSchema);