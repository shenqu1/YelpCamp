const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");


User = require("./models/User");

const methodOverride = require("method-override");

// seedDB = require("./seeds");

const campgroundRoutes = require("./controllers/campgrounds");
const commentRoutes = require("./controllers/comments");
const indexRoutes = require("./controllers/index");

//seedDB();


require("dotenv").config({path:'./config/keys.env'});

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(session({
    secret: `${process.env.SECRET}`,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`connected to MongoDB`);
})
.catch(err=>console.log(`Error while connecting to mongoDB ${err}`));



const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log("The YelpCamp Server Has Started!");
});