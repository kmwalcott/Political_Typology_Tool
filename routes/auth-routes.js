const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const Users = require('../models/Users');
const LocalStrategy = require('passport-local').Strategy;

//Passport Configuration I: Strategies
const authenticate_user = async (username, password, done) =>{
    try{
        const user = await Users.findOne({ username: username });
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' })
        }
        const password_compare = await bcrypt.compare(password, user.password);
        if(!password_compare){
            return done(null, false, { message: 'Incorrect password.' })
        }
        return done(null, user)  
    }
    catch (err){return done(err)}
}

passport.use(new LocalStrategy(authenticate_user));

//Passport Configuration III: Sessions
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    Users.findById(id, function(err, user) {
        done(err, user);
    });
});

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

//@Route get request to /auth/register
//@Description: Register page. 
//Access: Public
router.get('/register', signed_out_only, (req,res)=>{
    res.render('register');
})

//@Route post request to /auth/register
//@Description: Create new user account and credentials. Form submission. 
//Access: Public
router.post('/register', async (req,res)=>{
    try{
        const hashed_password = await bcrypt.hash(req.body.password, 10);
        var user_object = {
            "username": req.body.username,
            "password": hashed_password,
            "ideology":"",
            "econ_ideology":"",
            "social_ideology":"",
            "fp_ideology":"",
            "econ_score": 0,
            "social_score": 0,
            "fp_score": 0
        }
        var newUser = new Users(user_object);
        const result = await newUser.save();
        //console.log(result);
        res.redirect('http://localhost:5000/auth/signin');
    }
    catch{res.redirect('http://localhost:5000/auth/register');}
})

//@Route get request to /auth/signin
//@Description: Sign in page. 
//Access: Public
router.get('/signin', signed_out_only, (req,res)=>{
    res.render('signin');
})

//@Route post request to /auth/signin
//@Description: Sign in. Form submission. 
//Access: Public
router.post('/signin', passport.authenticate('local',{
    successRedirect: 'http://localhost:5000/my-dashboard/new-post',
    failureRedirect: 'http://localhost:5000/auth/signin',
    failureFlash: true
}))

//@Route delete request to /auth/signout
//@Description: Sign out. "Form" submission. 
//Access: Public
router.delete('/signout', (req,res)=>{
    req.logOut();
    res.redirect('http://localhost:5000/auth/signin');    
})


module.exports = router;