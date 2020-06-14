var mongoose = require('mongoose');

//Make mongoose schema 
var userSchema = new mongoose.Schema(
    {
    username: String,
    password: String,
    ideology: String,
    econ_ideology: String,
    social_ideology: String,
    fp_ideology: String,
    econ_score: Number,
    social_score: Number,
    fp_score: Number},
    {collection:'users'});


//Make mongoose model 
var Users = mongoose.model('Users', userSchema);

module.exports = Users;