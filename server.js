const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const posts_routes = require('./routes/posts-routes2.js');
const quiz_routes = require('./routes/quiz-routes');
const my_dashboard_routes = require('./routes/my-dashboard-routes3.js');
const auth_routes = require('./routes/auth-routes');
const path = require('path');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const method_override = require('method-override');

//Method override
app.use(method_override('_method'));

//Static folder
app.use(express.static('static'));

//Set up pug template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Parse json and urlencoded requests
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


//Passport Configuration II: Middleware
app.use(flash());
app.use(session(
    {secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//Start server
let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port, ()=> console.log(`Listening on port ${port}`));


//Connect to Mongo
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true})
    .then(()=> console.log('Mongo connected...'))
    .catch(err => console.log(err));

//Use routes
app.use('/posts',posts_routes);
app.use('/quiz', quiz_routes);
app.use('/my-dashboard', my_dashboard_routes);
app.use('/auth', auth_routes);
