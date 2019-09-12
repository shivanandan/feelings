const express = require('express');
const router = express.Router();
const User = require('../models/user');
const moment = require('moment');
const io = require('../app')


const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

function presentDayFeelingCheck(emotion){
    const { ondate } = emotion
    const today = moment().format("YYYY-MM-DD")
    const emotionDate = moment().format("YYYY-MM-DD")
    return moment(today).isSame(ondate); // true
   }

 function getTodayFeeling(emotion){
    const { ondate } = emotion
    const today = moment().format("YYYY-MM-DD")
    const emotionDate = moment().format("YYYY-MM-DD")
    return today === emotionDate 
 }  


 function emotionSummary(currEm, nextEm){
  const { ondate, mood, desc } = nextEm;
  currEm [mood] = currEm[mood] === undefined ?  1 :  currEm[mood] + 1;
   return currEm
 }
// Welcome Page


// io.on('connection', function (socket) {
//   // socket.emit('news', { hello: 'world' });
//   console.log("running connection")
  
// });
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

      
    
// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) =>{
  try {
    const users = await User.find()
  

    const summary = users
      .map(function(user){
        return user.feeling
      })
      .reduce(function(curr,next){
        return [...curr,...next]
      },[])
     .reduce(emotionSummary,{})
      console.log(summary)


      await pusher.trigger('notifications', 'post_updated', summary, req.headers['x-socket-id']);


    const {feeling} = req.user;

    if(feeling.some(getTodayFeeling)){
      const emotion =  feeling.find(getTodayFeeling)
      console.log(emotion, "today")

      res.render('dashboard', {
        user: req.user,
        email:req.email,
        emotion: emotion,
        summary: summary
      })
      return res.end()





  }





  }
  catch(err){
    console.log(err)
  }


  res.render('dashboard', {
    user: req.user,
    email:req.email,
    emotion:{},
    summary:{}
  })

});



router.get('/update/:email', async (req, res) => {

 const user = await User.findOne({ email: req.params.email })


  res.render('dashboard', {
    user: user,
    email:user.email,
    emotion:{},
    summary:{}
  })

})


// Capture mood
router.post('/capture', async (req, res) => {
  const { email, desc, mood } = req.body;
  let errors = [];
  if (!mood || !desc) {
    errors.push({ msg: 'Please enter all fields' });
  }
  console.log(email, desc, mood);
  //res.send(req.body);


  await User.findOne({ email: email }).then(user => {
    console.log('length:'+ user.feeling.length)
    if (user) {
      console.log(mood, desc, user.email);
      //User.feeling.push({mood : parseInt(mood)});
      user.feeling.push({
        mood: parseInt(mood),
        desc:desc
      }
      );


       user.save().then(()=>{
        res.redirect('/dashboard');

       })
    }
    else{
      console.log('error');
    }

})

 

});


module.exports = router;
