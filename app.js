const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const User = require('./models/user');

const express = require('express');
const app = express();

// var http = require('http').createServer(app);
var socket$ = require('socket.io');

// http.listen(8080)




// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(express.static('public'))
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));





const PORT = process.env.PORT || 5000;

 function emotionSummary(currEm, nextEm){
  const { ondate, mood, desc } = nextEm;
  currEm [mood] = currEm[mood] === undefined ?  1 :  currEm[mood] + 1;
   return currEm
 }
var server = app.listen(PORT, console.log(`Server started on port ${PORT}`));

const io = socket$(server)



async function summary(socket){
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
  
        socket.emit('summary', summary)
  }
  catch(error){

  }

}
io.on('connection', async function (socket) {
  // socket.emit('news', { hello: 'world' });
  console.log("running connection")
  summary(socket)
 


 socket.on('summary', async function(emotionInfo){

       console.log(emotionInfo);
 const { mood, email,desc } = emotionInfo;



 const user = await User.findOne({ email: email })
 console.log('length:'+ user.feeling.length)

    if (user) {
      console.log(mood, desc, user.email);
      user.feeling.push({
        mood: parseInt(mood),
        desc:desc
      }
      );


      await user.save()
      summary(io)
    }
    else{
      console.log('error');
    }

  });


  
});

// module.exports = app
