const express= require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");

router.get("/", (req, res)=>{
    res.render("landing");
});

router.get("/register", (req,res)=>{
    res.render("register", {
        page: "register"
    });
});

router.post("/register", (req,res)=>{
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password)
    .then((user)=>{
        passport.authenticate("local")(req, res, function(){
            req.flash("success", `Welcome to YelpCamp ${user.username}`);
            res.redirect("/campgrounds");
        });
    })
    .catch((err)=>{
        req.flash("error", err.message);
        res.redirect("register");
    });
});

router.get("/login", (req,res)=>{
    res.render("login", {
        page: "login"
    });
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req,res)=>{
});

router.get("/logout", (req,res)=>{
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;