const express= require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");

router.get("/", (req, res)=>{
    res.render("landing");
});

router.get("/register", (req,res)=>{
    res.render("register");
});

router.post("/register", (req,res)=>{
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password)
    .then(()=>{
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    })
    .catch((err)=>{
        console.log(err);
        res.render("register");
    });
});

router.get("/login", (req,res)=>{
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req,res)=>{
});

router.get("/logout", (req,res)=>{
    req.logout();
    res.redirect("/campgrounds");
});

module.exports = router;