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
        "video":"",
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
            //limit result count to 100
            if(result.length > 100){
                res.redirect('../refine-your-query.html');
            }
            else{
                let photo_url = 'optimized-question2.jpg';
                let title1 = 'How Federal Tax Reform Has Affected Real Estate';
                let title2 = 'GOP Tax Law Could Starve Cities of Revenue';
                let title3 = 'Why Low-Tax States Could Come To Dislike The New Tax Law, Too';
                let link1 = 'https://www.governing.com/topics/finance/gov-2017-federal-tax-reform-real-estate.html';
                let link2 = 'https://www.governing.com/topics/finance/gov-trump-gop-property-taxes-home-values-lc.html';
                let link3 = 'https://www.governing.com/week-in-finance/gov-finance-roundup-state-local-tax-deduction-cap.html';
                let link4 = '../articles/castle-doctrine.html';
                    switch(question){
                        case 'question1':
                            photo_url = 'optimized-question1.jpg';
                            title1 = 'GOP Tax Law Could Starve Cities of Revenue (Governing.com)';
                            title2 = 'It’s time to gut the mortgage interest deduction (Brookings Institution)';
                            title3 = 'It’s Time to Repeal the Home Mortgage Interest Deduction (Niskanen Center)';
                            link1 = 'https://www.governing.com/topics/finance/gov-trump-gop-property-taxes-home-values-lc.html';
                            link2 = 'https://www.brookings.edu/blog/up-front/2017/11/06/its-time-to-gut-the-mortgage-interest-deduction/';
                            link3 = 'https://www.niskanencenter.org/time-repeal-home-mortgage-interest-deduction/';
                            link4 = '../articles/mortgage-interest-deduction.html';
                            break;
                        case 'question2':
                            photo_url = 'optimized-question2.jpg';
                            title1 = '6 Ways States are Addressing the Doctor Shortage (Governing.com)';
                            title2 = "Opioid Treatment Hampered by States' Nursing Laws (Governing.com)";
                            title3 = 'Whitmer extends order loosening scope of practice laws for health care workers (Michigan Live)';
                            link1 = 'https://www.governing.com/blogs/view/gov-states-addressing-doctor-shortage.html';
                            link2 = 'https://www.governing.com/topics/health-human-services/sl-nurse-licensing-laws-opioid-treatment.html';
                            link3 = 'https://www.mlive.com/public-interest/2020/04/whitmer-extends-order-loosening-scope-of-practice-laws-for-health-care-workers.html';
                            link4 = '../articles/scope-of-practice.html';
                            break;
                        case 'question3':
                            photo_url = 'optimized-question3.jpg';
                            title1 = 'State Marijuana Laws in 2019 Map';
                            title2 = 'No One Really Knows How Much Money Marijuana Will Bring to States';
                            title3 = 'About Marijuana (Norml)';
                            link1 = 'https://www.governing.com/gov-data/state-marijuana-laws-map-medical-recreational.html';
                            link2 = 'https://www.governing.com/news/headlines/no-one-really-know-how-much-money-marijuana-will-bring-to-states.html';
                            link3 = 'https://norml.org/marijuana/';
                            link4 = '../articles/marijuana.html';
                            break;
                        case 'question4':
                            photo_url = 'optimized-question4.jpg';
                            title1 = '';
                            title2 = '';
                            title3 = '';
                            link1 = '';
                            link2 = '';
                            link3 = '';
                            break;
                        case 'question5':
                            photo_url = 'optimized-question5.jpg';
                            title1 = 'Is US defense spending too high, too low, or just right?';
                            title2 = 'Why Does the US Spend So Much on Defense?';
                            title3 = 'Military Communities Brace for Sequestration Cuts';
                            link1 = 'https://www.brookings.edu/policy2020/votervital/is-us-defense-spending-too-high-too-low-or-just-right/';
                            link2 = 'https://www.defenseone.com/ideas/2020/01/why-does-us-spend-so-much-defense/162657/';
                            link3 = 'https://www.governing.com/blogs/fedwatch/gov-military-communities-brace-for-sequestration-cuts.html';
                            link4 = '../articles/defense-spending.html';
                            break;
                        case 'question6':
                            photo_url = 'optimized-question6.jpg';
                            title1 = '';
                            title2 = '';
                            title3 = '';
                            link1 = '';
                            link2 = '';
                            link3 = '';
                            break;
                        case 'question7':
                            photo_url = 'optimized-question7.jpg';
                            title1 = 'How Federal Tax Reform Has Impacted Real Estate';
                            title2 = 'Final IRS Rules Leave States Few Options for Evading the SALT Cap';
                            title3 = 'Top House Republican Expects to Keep Limited State and Local Tax Deduction';
                            link1 = 'https://www.governing.com/topics/finance/gov-2017-federal-tax-reform-real-estate.html';
                            link2 = 'https://www.governing.com/week-in-finance/gov-irs-2017-tax-reform-salt-cap-states-trump.html';
                            link3 = 'https://www.governing.com/topics/finance/tns-state-local-tax-deduction-congress-brady.html';
                            link4 = '../articles/salt-deduction.html';
                            break;
                        case 'question8':
                            photo_url = 'optimized-question8.jpg';
                            title1 = '';
                            title2 = '';
                            title3 = '';
                            link1 = '';
                            link2 = '';
                            link3 = '';
                            break;
                        case 'question9':
                            photo_url = 'optimized-question9.jpg';
                            title1 = 'Should We Stop Licensing Doctors and Lawyers?';
                            title2 = 'End State Licensing of Physicians';
                            title3 = 'Milton Friedman on Medical Licensing';
                            link1 = 'https://www.gsb.stanford.edu/insights/should-we-stop-licensing-doctors-lawyers';
                            link2 = 'https://thehill.com/blogs/congress-blog/healthcare/250457-end-state-licensing-of-physicians';
                            link3 = 'https://www.sabhlokcity.com/2019/01/against-the-governments-licensing-of-doctors-milton-friedman/';
                            link4 = '../articles/medical-licensing.html';
                            break;
                        case 'question10':
                            photo_url = 'optimized-question10.jpg';
                            title1 = 'Can You Take The Bar Exam Without Going To Law School?';
                            title2 = "Students try to avoid law school costs with 'reading law' path to law license";
                            title3 = 'How To Be A Lawyer Without Going To Law School';
                            link1 = 'https://www.indeed.com/career-advice/career-development/can-you-take-the-bar-exam-without-going-to-law-school';
                            link2 = 'https://www.abajournal.com/news/article/want_to_avoid_the_costs_of_law_school_these_students_try_reading_law_path_t';
                            link3 = 'https://priceonomics.com/how-to-be-a-lawyer-without-going-to-law-school/';
                            link4 = '../articles/reading-law.html';
                            break;
                        case 'question11':
                            photo_url = 'optimized-question11.jpg';
                            title1 = "Compulsory Schooling Laws: What if We Didn't Have Them?";
                            title2 = 'Abolish Compulsory Education';
                            title3 = 'The K-12 Conundrum: Americans Want More Education Funding, But Not Higher Taxes';
                            link1 = 'https://fee.org/articles/compulsory-schooling-laws-what-if-we-didnt-have-them/';
                            link2 = 'https://thefederalist.com/2014/02/04/abolish-compulsory-education/#:~:text=It%20takes%20a%20truly%20unimaginative,exist%20would%20be%20compulsory%20education.';
                            link3 = 'https://www.governing.com/topics/education/gov-raising-funding-public-schools.html';
                            link4 = '../articles/privatizing-k12-education.html';
                            break;
                        case 'question12':
                            photo_url = 'optimized-question12.jpg';
                            title1 = 'How Higher Ed Became a Partisan Wedge Issue';
                            title2 = 'Public Universities Reaching a Tipping Point';
                            title3 = 'The Politics of Rising Tution Costs';
                            link1 = 'https://www.governing.com/topics/education/gov-college-campus-politics-states-debate-partisanship.html';
                            link2 = 'https://www.governing.com/topics/education/gov-public-universities-reach-tipping-point.html';
                            link3 = 'https://www.governing.com/columns/washington-watch/col-politics-of-rising-tuition.html';
                            link4 = '../articles/privatizing-higher-education.html';
                            break;
                        case 'question13':
                            photo_url = 'optimized-question13.jpg';
                            title1 = "Compulsory Schooling Laws: What if We Didn't Have Them?";
                            title2 = 'Abolish Compulsory Education';
                            title3 = 'Going Native';
                            link1 = 'https://fee.org/articles/compulsory-schooling-laws-what-if-we-didnt-have-them/';
                            link2 = 'https://thefederalist.com/2014/02/04/abolish-compulsory-education/#:~:text=It%20takes%20a%20truly%20unimaginative,exist%20would%20be%20compulsory%20education.';
                            link3 = 'https://www.governing.com/blogs/view/Going-Native.html';
                            link4 = '../articles/compulsory-schooling.html';
                            break;
                        case 'question14':
                            photo_url = 'optimized-question14.jpg';
                            title1 = 'Will Up-zoning Make Housing More Affordable?';
                            title2 = 'Affordable Housing Efforts Challenge Single-Family Zoning';
                            title3 = 'Is zoning a useful tool or a regulatory barrier?';
                            link1 = 'https://www.governing.com/topics/urban/gov-zoning-density.html';
                            link2 = 'https://www.governing.com/topics/health-human-services/sl-Affordable-Housing-Efforts-Challenge-Single-Family-Zoning.html';
                            link3 = 'https://www.brookings.edu/research/is-zoning-a-useful-tool-or-a-regulatory-barrier/';
                            link4 = '../articles/single-family-zoning.html';
                            break;
                        case 'question15':
                            photo_url = 'optimized-question15.jpg';
                            title1 = '';
                            title2 = '';
                            title3 = '';
                            link1 = '';
                            link2 = '';
                            link3 = '';
                            break;
                        case 'question16':
                            photo_url = 'optimized-question16.jpg';
                            title1 = '';
                            title2 = '';
                            title3 = '';
                            link1 = '';
                            link2 = '';
                            link3 = '';
                            break;
                        case 'question17':
                            photo_url = 'optimized-question17.jpg';
                            title1 = 'Lawmakers Call For Legalization of Prostitution in New York (Governing.com)';
                            title2 = 'Countries and Their Prostitution Policies';
                            title3 = 'Why is Prostitution Still Illegal (John Stossel)';
                            link1 = 'https://www.governing.com/topics/public-justice-safety/Lawmakers-Call-for-Legalization-of-Prostitution-in-New-York.html';
                            link2 = 'https://prostitution.procon.org/countries-and-their-prostitution-policies/#mexico';
                            link3 = 'https://www.youtube.com/watch?v=Z23yQFx6MJ0';
                            link4 = '../articles/prostitution.html';
                            break;
                        case 'question18':
                            photo_url = 'optimized-question18.jpg';
                            title1 = "Mr. Conservative: Barry Goldwater's opposition to the Civil Rights Act of 1964";
                            title2 = "Fox's Stossel Advocates Repealing Part of the Civil Rights Act";
                            title3 = 'How Gary Becker saw the scourge of discrimination';
                            link1 = 'https://www.youtube.com/watch?v=JJyWWM9OHKA';
                            link2 = 'https://www.youtube.com/watch?v=xhd_TP5rG0c';
                            link3 = 'https://review.chicagobooth.edu/magazine/winter-2014/how-gary-becker-saw-the-scourge-of-discrimination';
                            link4 = '../articles/racial-discrimination.html';
                            break;
                        case 'question19':
                            photo_url = 'optimized-question19.jpg';
                            title1 = 'Teaching Tolerance- Social Justice Standards';
                            title2 = 'Black Lives Matter Comes to the Classroom';
                            title3 = 'Fairfax, Va. School District Spent $24,000 On Ibram Kendi Books For U.S. History Classes';
                            link1 = 'https://www.tolerance.org/frameworks/social-justice-standards';
                            link2 = 'https://www.city-journal.org/black-lives-matter-in-the-classroom';
                            link3 = 'https://thefederalist.com/2020/09/30/fairfax-va-school-district-spent-24000-on-ibram-kendi-books-for-u-s-history-classes/';
                            link4 = '../articles/social-justice-in-schools.html';
                            break;
                        case 'question20':
                            photo_url = 'optimized-question20.jpg';
                            title1 = 'Summary of Critical Race Theory Investigations';
                            title2 = 'White Men as Full Diversity Partners';
                            title3 = 'Critical Race Theory, and Trumps War on It, Explained';
                            link1 = 'https://christopherrufo.com/summary-of-critical-race-theory-investigations/';
                            link2 = 'https://wmfdp.com/';
                            link3 = 'https://www.vox.com/2020/9/24/21451220/critical-race-theory-diversity-training-trump';
                            link4 = '../articles/diversity-training-government-employees.html';
                            break;
                        case 'question21':
                            photo_url = 'optimized-question21.jpg';
                            title1 = '';
                            title2 = '';
                            title3 = '';
                            link1 = '';
                            link2 = '';
                            link3 = '';
                            break;
                        case 'question22':
                            photo_url = 'optimized-question22.jpg';
                            title1 = 'Policing Is Racially Biased (Intelligence Squared Debates)';
                            title2 = 'Repudiate the Anti-Police Narrative';
                            title3 = 'The “abolish the police” movement, explained by 7 scholars and activists';
                            link1 = 'https://www.youtube.com/watch?v=3TInGHcG-_Q';
                            link2 = 'https://www.city-journal.org/repudiate-the-anti-police-narrative';
                            link3 = 'https://www.vox.com/policy-and-politics/2020/6/12/21283813/george-floyd-blm-abolish-the-police-8cantwait-minneapolis';
                            link4 = '../articles/defund-the-police.html';
                            break;
                        case 'question23':
                            photo_url = 'optimized-question23.jpg';
                            title1 = 'The Effects of Stand Your Ground Laws';
                            title2 = 'Self Defense and “Stand Your Ground”';
                            title3 = 'Gun Laws (NRA Institute for Legislative Action)';
                            link1 = 'https://www.rand.org/research/gun-policy/analysis/stand-your-ground.html';
                            link2 = 'https://www.ncsl.org/research/civil-and-criminal-justice/self-defense-and-stand-your-ground.aspx';
                            link3 = 'https://www.nraila.org/gun-laws/';
                            link4 = '../articles/castle-doctrine.html';
                            break;
                        case 'question24':
                            photo_url = 'optimized-question24.jpg';
                            title1 = 'The Effects of Stand Your Ground Laws';
                            title2 = 'Self Defense and “Stand Your Ground”';
                            title3 = 'Gun Laws (NRA Institute for Legislative Action)';
                            link1 = 'https://www.rand.org/research/gun-policy/analysis/stand-your-ground.html';
                            link2 = 'https://www.ncsl.org/research/civil-and-criminal-justice/self-defense-and-stand-your-ground.aspx';
                            link3 = 'https://www.nraila.org/gun-laws/';
                            break;
                        case 'question25':
                            photo_url = 'optimized-question25.jpg';
                            title1 = 'ICNL US Protest Law Tracker';
                            title2 = 'As Protests Escalate Under Trump, States Seek New Ways to Deter Them';
                            title3 = 'Tough-on-Protesting Bills Worry Free-Speech Advocates';
                            link1 = 'https://www.icnl.org/usprotestlawtracker/';
                            link2 = 'https://www.governing.com/topics/politics/gov-protests-st-louis-states-laws-restrictions.html';
                            link3 = 'https://www.governing.com/topics/politics/When-Does-Protest-Cross-a-Line-Some-States-Aim-to-Toughen-Laws.html';
                            link4 = '../articles/liability-for-hitting-protesters.html';
                            break;
                        case 'question26':
                            photo_url = 'optimized-question26.jpg';
                            title1 = '';
                            title2 = '';
                            title3 = '';
                            link1 = '';
                            link2 = '';
                            link3 = '';
                            break;
                        case 'question27':
                            photo_url = 'optimized-question25.jpg';//use pic and articles from question 25
                            title1 = 'ICNL US Protest Law Tracker';
                            title2 = 'As Protests Escalate Under Trump, States Seek New Ways to Deter Them';
                            title3 = 'Tough-on-Protesting Bills Worry Free-Speech Advocates';
                            link1 = 'https://www.icnl.org/usprotestlawtracker/';
                            link2 = 'https://www.governing.com/topics/politics/gov-protests-st-louis-states-laws-restrictions.html';
                            link3 = 'https://www.governing.com/topics/politics/When-Does-Protest-Cross-a-Line-Some-States-Aim-to-Toughen-Laws.html';
                            link4 = '../articles/crimes-committed-during-protests.html';
                            break;
                        case 'question28':
                            photo_url = 'optimized-question28.jpg';
                            title1 = "Don't Be Fooled. Trump’s Cuts to WHO Aren’t About the Coronavirus";
                            title2 = 'Trump Sets Date To End WHO Membership Over Its Handling Of Virus';
                            title3 = 'How China Outsmarted the Trump Administration';
                            link1 = 'https://www.defenseone.com/ideas/2020/04/trumps-cuts-who-arent-about-coronavirus/164631/';
                            link2 = 'https://www.npr.org/sections/goatsandsoda/2020/07/07/888186158/trump-sets-date-to-end-who-membership-over-its-handling-of-virus#:~:text=The%20U.S.%20has%20sent%20a,email%20to%20reporters%2C%20a%20U.N.';
                            link3 = 'https://www.defenseone.com/ideas/2020/10/how-china-outsmarted-trump-administration/169125/';
                            link4 = '../articles/withdrawing-from-who.html';
                            break;
                        default:
                            photo_url = 'optimized-question2.jpg';
                    }
                
                for (let i=0; i < result.length; i++){
                    if (result[i].stance == "lib"){
                        lib_posts.push(result[i]);
                    }
                    else if (result[i].stance =="int"){
                        int_posts.push(result[i]);
                    }
                }
                
                res.render('search.pug', {lib_posts:lib_posts, int_posts:int_posts, photo_url:photo_url, title1:title1, title2:title2, title3:title3, link1:link1, link2:link2, link3:link3, link4:link4});
            }
        } 
    }).sort({upvotes:-1})
    
});


//@Route post request to /posts/update
//@Description: Edit post. Form submission.
//Access: password required
router.post('/update', (req,res) =>{
    
    Posts.findOneAndUpdate({ "_id":req.body._id},{"politician":req.body.politician, "state":req.body.state, "level":req.body.level,"question":req.body.question, "stance":req.body.stance, "content":req.body.content, "party":req.body.party, "video":""}, {useFindAndModify: false}, (err,result)=>{
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
