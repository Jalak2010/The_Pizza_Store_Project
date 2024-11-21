require("dotenv").config();

const express = require("express");

const app = express();

const PORT = process.env.PORT || 4000;

const ejs = require("ejs");

const path = require("path");

const expressLayout = require("express-ejs-layouts");

const mongoose = require("mongoose");

const session = require("express-session");

const flash = require("express-flash");

const MongoDbStore = require("connect-mongo")(session);

const passport = require('passport');

const Emitter = require('events')




// Database Connection:-

const url = 'mongodb://localhost/pizza';

mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true});

const connection = mongoose.connection;

connection.once('open', ()=> {
   console.log('Database Created Sucessfully');
}).catch(err=> {
   console.log('connection failed');
})



//session connection with database
let mongoStore =  new MongoDbStore({
   mongooseConnection : connection,
   collection : 'sessions'
})

// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)


//Session Configuration:-
app.use(session({
   secret : process.env.COOKIE_SECRET,
   store : mongoStore,
   resave : false,
   saveUninitialized : false,
   cookie : { maxAge: 1000 * 60 * 60 * 24}   //24 hours sudhi cookie store rey...
}));

// passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash());
//public folder path
app.use(express.static('public'));   

app.use(express.urlencoded({extended: false}));          

app.use(express.json());


//global middlware
app.use((req,res,next)=> {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})


//set views folder path:- 
app.use(expressLayout);

app.set("view engine", "ejs");

const viewsPath = path.join(__dirname, '/resources/views');

app.set("views", viewsPath);


// define routes and call the function from web.js

require("./routes/web")(app);




const server =  app.listen(PORT, (req,res)=>{
   console.log(`server running at ${PORT}`);
});


//socket.io

const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join
      socket.on('join', (orderId) => {
         console.log(orderId);
        socket.join(orderId)
      })
})

eventEmitter.on('orderUpdated', (data) => {
   io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
   io.to('adminRoom').emit('orderPlaced', data)
})
