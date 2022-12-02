const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    adminCheck: {
        type: Boolean,
        default: false
    }
});

userSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

userSchema.set("toJSON", {
    virtuals: true
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;