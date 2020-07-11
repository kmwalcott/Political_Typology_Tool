const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Posts = require('../models/Posts.js');
const bcrypt = require('bcrypt');
const passport = require('passport');

//Middleware to check authentication
function signed_in_only(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/auth/signin');
}

function signed_out_only(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/my-dashboard/new-post');
    }
    next();
}

//@Route post request to /posts
//@Description: Create a post. Form submission. 
//Access: Password required
router.post('/', (req,res) =>{
    
    post_object = {
        "politician":req.body.politician,
        "party":req.body.party,
        "state":req.body.state,
        "level":req.body.level,
        "question":req.body.question,
        "stance":req.body.stance,
        "content":req.body.content,
        "video":req.body.video,
        "user":req.user.username,
        "upvotes": 0,
        "flagged": false,
        "flag_message": "",
        "upvoters": [],
        "flaggers": []
    }
    var newPost = new Posts(post_object);
    newPost.save((err,result)=>{
        if(err){res.status(400).send(err)}
        //else{res.status(200).json(result)}
        else{res.redirect('/my-dashboard/new-post');
        }
    })
});

//@Route post request to /posts/search
//@Description: Get posts by applying search filter. Form submission.
router.post('/search', (req,res) =>{
    var body = req.body;
    let politician = body.politician;
    let party = body.party;
    let state = body.state;
    let level = body.level;
    let question = body.question;
    let search_by = body.search_by;
    let conditional_filter = {};
    
    if (search_by == 'Question'){
        conditional_filter.question = question;
        if (politician.length > 0) {
        conditional_filter.politician = politician;
        }
        if (state.length > 0) {
        conditional_filter.state = state;
        }
        if (level.length > 0) {
        conditional_filter.level = level;
        }
        if (party.length > 0) {
            conditional_filter.party = party;
        }
        
    } 

    else{
        conditional_filter.politician = politician;
        if (question.length > 0) {
            conditional_filter.question = question;
        }
        if (state.length > 0) {
            conditional_filter.state = state;
        }
        if (level.length > 0) {
            conditional_filter.level = level;
        } 
        if (party.length > 0) {
            conditional_filter.party = party;
        }
    }

    let lib_posts = [];
    let int_posts = [];
   
    
    Posts.find(conditional_filter, (err,result)=>{
        if(err){res.status(400).send(err)}
        //else{res.status(200).send(result[0].politician)}
        
        else{
            
            for (let i=0; i < result.length; i++){
                if (result[i].stance == "lib"){
                    lib_posts.push(result[i]);
                }
                else if (result[i].stance =="int"){
                    int_posts.push(result[i]);
                }
            }
            
            
            res.render('search.pug', {lib_posts:lib_posts, int_posts:int_posts});
        } 
    }).sort({upvotes:-1})
    
    });


//@Route post request to /posts/update
//@Description: Edit post. Form submission.
//Access: password required
router.post('/update', (req,res) =>{
    
    Posts.findOneAndUpdate({ "_id":req.body._id},{"politician":req.body.politician, "state":req.body.state, "level":req.body.level,"question":req.body.question, "stance":req.body.stance, "content":req.body.content, "party":req.body.party, "video":req.body.video}, {useFindAndModify: false}, (err,result)=>{
        if(err){res.status(400).send(err)}
        else{res.redirect('/my-dashboard/my-posts')}
    })
});


//@Route put request to /posts/upvotes
//@Description: Upvote a post. AJAX request.
//@Access: Password required
router.put('/upvotes', (req,res) =>{
    
    var my_id = req.body._id;
    var my_username = req.body.username;
    
    
    Posts.findOneAndUpdate({ "_id":my_id },{$inc: {upvotes:1}, $push:{upvoters:my_username}},(err,result)=>{
        if(err){res.status(400).send(err)}
        else{
           

        }
    })
});


//@Route put request to /posts/downvotes
//@Description: Upvote a post. AJAX request.
//@Access: Password required
router.put('/downvotes', (req,res) =>{
    
    var my_id = req.body._id;
    var my_username = req.body.username;
    
    
    Posts.findOneAndUpdate({ "_id":my_id },{$inc: {upvotes:-1}, $pull:{upvoters:my_username}},(err,result)=>{
        if(err){res.status(400).send(err)}
        else{
           

        }
    })
});



//@Route put request to /posts/flag
//@Description: Flag a post. AJAX request.
//@Access: Password required
router.put('/flag', (req,res) =>{
    
    var my_id = req.body._id;
    var my_username = req.body.username;
    var message = req.body.flag_message;
    
    
    Posts.findOneAndUpdate({ "_id":my_id },{"flagged":true, $push:{flaggers:my_username},"flag_message":message},(err,result)=>{
        if(err){res.status(400).send(err)}
        else{
            
        }
    })
});

//@Route put request to /posts/unflag
//@Description: Flag a post. AJAX request.
//@Access: Password required
router.put('/unflag', (req,res) =>{
    
    var my_id = req.body._id;
    var my_username = req.body.username;
    
    
    Posts.findOneAndUpdate({ "_id":my_id },{"flagged":false, $pull:{flaggers:my_username}},(err,result)=>{
        if(err){res.status(400).send(err)}
        else{
            
        }
    })
});


//@Route delete request to /posts
//@Description: Delete post. AJAX request.
//@Access: Password required
router.delete('/', (req,res) =>{
    
    Posts.deleteOne({ "_id":req.body._id},(err,result)=>{
        if(err){res.status(400).send(err)}
    })
});

module.exports = router;
