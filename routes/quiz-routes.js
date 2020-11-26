const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = require('../models/Users.js');
const bcrypt = require('bcrypt');
const passport = require('passport');

//Middleware to redirect authenticated users to their quiz results if they've already taken the quiz
async function get_existing_results(req, res, next){
    try{
        if(req.isAuthenticated()){
            var user = await Users.findOne({username: req.user.username});
            if (user.ideology.length === 0){
                return next()
            }
            else{
                res.render('quiz-results', {ideology: user.ideology, econ_ideology: user.econ_ideology, econ_score: user.econ_score, social_ideology: user.social_ideology, social_score: user.social_score, fp_ideology: user.fp_ideology, fp_score: user.fp_score})
            }
        }
        else{
            return next()
        }
    }
    catch (err){return err}   
}

//@Route get request to /quiz
//@Description: Go to quiz. 
router.get('/', get_existing_results, (req,res)=> {
    res.redirect('/political-quiz.html');
})

//@Route get request to /quiz/retake-quiz
//@Description: Go to quiz. 
router.get('/retake-quiz', (req,res)=> {
    res.redirect('/political-quiz.html');
})

//@Route post request to /quiz
//@Description: Submit quiz. Form submission.
router.post('/', (req,res) =>{
   
    //Initialize variables
let econ_score = 0;
let social_score = 0;
let fp_score = 0;
let scores = [];
let ideologies = [];
mod_score = 0;

    //Calculate scores 
var body = req.body;
var econ_number_answered = 0;
var social_number_answered = 0;
var fp_number_answered = 0;

var i = 0;

//Remember to change i every time the number of questions changes!
for (var question in body){
    if (i < 10 && typeof body[question] === 'string') { // < # of econ questions
        econ_score = econ_score + parseInt(body[question]);
        i = i+1;
        econ_number_answered++;
        //console.log(typeof(body[question]));
    }
    else if (i< 16 && typeof body[question] === 'string') { // < # of econ questions + # of social questions
        social_score = social_score + parseInt(body[question]);
        i = i+1;
        social_number_answered++;
    }

    else if (i< 21 && typeof body[question] === 'string') { // < # of econ questions + # of social questions + # of fp questions 
        fp_score = fp_score + parseInt(body[question]);
        i = i +1;
        fp_number_answered++; 
    }
    
}

//Ensure no zero-values in denominator before scores are normalized
if(econ_number_answered === 0){
    econ_number_answered = 1;
}
if(social_number_answered === 0){
    social_number_answered = 1;
}
if(fp_number_answered === 0){
    fp_number_answered = 1;
}

//Normalize scores (place in range of -1 to +1)
econ_score = econ_score/econ_number_answered;
social_score = social_score/social_number_answered;
fp_score = fp_score/fp_number_answered; 

scores = [econ_score, social_score, fp_score];

//Classify each score as libertarian, moderate, 
//or interventionist. Count the number of moderate scores.  
scores.forEach(function(score){
    if (score >= -1 && score < -1/3){ //from -1 to -1/3
        ideology = "Libertarian";
    }
    else if (score >= -1/3 && score < 1/3){//from -1/3 to +1/3
        ideology = "Moderate";
        mod_score = mod_score + 1;
    }
    else if (score >= 1/3 && score <= 1){//from +1/3 to +1
        ideology = "Interventionist";
    }
    ideologies.push(ideology);
})


let econ_ideology = ideologies[0];
let social_ideology = ideologies[1];
let fp_ideology = ideologies[2];
ideology = get_ideology(econ_ideology,social_ideology,fp_ideology);


function get_ideology (econ_ideology, social_ideology, fp_ideology){
    if (econ_ideology=="Interventionist" && social_ideology=="Libertarian" && fp_ideology!="Interventionist"){
    ideology = "Liberal";        
    }
    else if (econ_ideology=="Libertarian" && social_ideology=="Libertarian" && fp_ideology=="Libertarian"){
        ideology = "Libertarian";
    }
    else if (econ_ideology=="Libertarian" && social_ideology=="Interventionist"){
        ideology = "Conservative";
    }
    else if (mod_score >= 2){
        ideology = "Moderate";
    }
    else {
        ideology = "Other"
    }
    return ideology;
}

if (typeof req.user !== 'undefined'){
    Users.findOneAndUpdate({"username": req.user.username}, {"ideology":ideology, "econ_ideology":econ_ideology, "econ_score":econ_score, "social_ideology":social_ideology, "social_score":social_score, "fp_ideology":fp_ideology, "fp_score":fp_score}, {useFindAndModify: false}, (err,result)=>{
        if(err){res.status(400).send(err)}
        
        //Dynamically generate ideology reveal page
        //Variables needed: ideology, econ_score, social_score, fp_score, econ_ideology, social_ideology, and fp_ideology
        else{
            res.render('quiz-results', {ideology:ideology, econ_ideology:econ_ideology, econ_score:econ_score, social_ideology:social_ideology, social_score:social_score, fp_ideology:fp_ideology, fp_score:fp_score})
        }
    })
}

else{
    res.render('quiz-results', {ideology:ideology, econ_ideology:econ_ideology, econ_score:econ_score, social_ideology:social_ideology, social_score:social_score, fp_ideology:fp_ideology, fp_score:fp_score})
}

})

module.exports = router;

