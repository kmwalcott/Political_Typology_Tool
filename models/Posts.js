var mongoose = require('mongoose');

//Make mongoose schema 
var postSchema = new mongoose.Schema(
    {
    politician: String,
    party: String,
    state: String,
    level: String,
    question: String,
    stance: String,
    content: String,
    video: String,
    user: String,
    upvotes: Number,
    flagged: Boolean,
    flag_message: String, 
    upvoters: [String],
    flaggers:[String]},
    
    {collection: 'posts'});


    //Make mongoose model 
var Posts = mongoose.model('Posts', postSchema);

module.exports = Posts;



