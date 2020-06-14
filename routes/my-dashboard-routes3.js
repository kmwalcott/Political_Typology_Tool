const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const Posts = require('../models/Posts.js');
const Users = require('../models/Users.js');
const bcrypt = require('bcrypt');
const passport = require('passport');

//Middleware to check authentication
function signed_in_only(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('http://localhost:5000/auth/signin');
}

function signed_out_only(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('http://localhost:5000/my-dashboard/new-post');
    }
    next();
}

router.get('/my-posts', signed_in_only, (req,res)=>{
    
    var all_posts = [];
    Posts.find({user: req.user.username},(err,result)=>{
        
        if(err){res.status(400).send(err)}
        else{
            for (let i=0; i < result.length; i++){
                all_posts.push(result[i]);
            }
        }
        res.render('my-posts', {all_posts:all_posts});
    }).sort({upvotes:-1})  
    
})

router.get('/upvoted-posts', signed_in_only, (req,res)=>{
    var upvoted_posts = [];
    
    Posts.find({upvoters: req.user.username},(err,result)=>{
        
        if(err){res.status(400).send(err)}
        else{
            for (let i=0; i < result.length; i++){
                upvoted_posts.push(result[i]);
            }
        }
        res.render('upvoted-posts', {upvoted_posts:upvoted_posts});
    }).sort({upvotes:-1})  
    
})



router.get('/flagged-posts', signed_in_only, (req,res)=>{
    var flagged_posts = [];
    
    Posts.find({flaggers: req.user.username},(err,result)=>{
        
        if(err){res.status(400).send(err)}
        else{
            for (let i=0; i < result.length; i++){
                flagged_posts.push(result[i]);
            }
        }
        res.render('flagged-posts.pug', {flagged_posts:flagged_posts});
    }).sort({upvotes:-1})  

})

//FIXME: Must work on all quiz routes. 
router.get('/quiz', signed_in_only, (req,res)=>{
    var user = 'kwalcott';
    var quiz_taker = [];

    Users.findOne({username:user}, (err,result)=>{
        if(err){res.status(400).send(err)}
        else{
            //quiz_taker[0] = result[0];
        }
        console.log(result);
        //res.render('quiz',{quiz_taker:quiz_taker});
        res.end();
    })
})

router.get('/new-post', signed_in_only, (req,res)=>{
    res.render('new-post')
})



module.exports = router;