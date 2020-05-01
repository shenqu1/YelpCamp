const express = require("express");
const router = express.Router({
    mergeParams: true
});
const Campground = require("../models/campground");
const Comment = require("../models/comment");

router.get("/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id)
        .then((campground) => {
            res.render("comments/new", {
                campground
            });
        })
        .catch(err => console.log(err));

});

router.post("/", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id)
        .then((campground) => {
            Comment.create(req.body.comment)
                .then((comment) => {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save()
                        .then(() => {
                            campground.comments.push(comment);
                            campground.save()
                                .then(() => {
                                    res.redirect(`/campgrounds/${campground._id}`);
                                })
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/campgrounds");
        });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;