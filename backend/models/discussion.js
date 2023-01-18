const mongoose = require('mongoose');

const discussionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
})

discussionSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

discussionSchema.set("toJSON", {
    virtuals: true
});

exports.Discussion = mongoose.model('Discussion', discussionSchema);