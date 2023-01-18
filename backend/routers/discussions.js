const {Discussion} = require('../models/discussion');
const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const expressAsyncHandler = require("express-async-handler");

router.get(`/`, async (req, res) =>{
    const discussionList = await Discussion.find().select("title comment");

    if(!discussionList) {
        res.status(500).json({success: false})
    } 
    res.send(discussionList);
})

router.post("/", expressAsyncHandler (async(req, res) =>{
    let discussion = new Discussion({
        title: req.body.title,
        comment: req.body.comment,
    })
    discussion = await discussion.save();

    if (!discussion){
        return res.status(404).send("The creation of Discussion was not successful");
    }

    res.send(discussion);
}))

router.get("/:discussionId", async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.discussionId)) {
        const discussionList = await Discussion.findById(req.params.discussionId);
    
        if(!discussionList) {
            res.status(500).json({success: false})
        }
        
        res.send(discussionList);
    }else{
        res.status(404).json({success: false, message: "The searched discussion post was not found"});
      }
})

module.exports =router;