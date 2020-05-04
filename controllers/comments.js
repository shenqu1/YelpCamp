const express = require("express");
const router = express.Router({
    mergeParams: true
});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id)
        .then((campground) => {
            res.render("comments/new", {
                campground
            });
        })
        .catch(err => console.log(err));

});

router.post("/", middleware.isLoggedIn, (req, res) => {
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

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req,res)=>{
    Comment.findById(req.params.comment_id)
    .then((comment)=>{
        res.render("comments/edit", {
            campground_id: req.params.id,
            comment: comment
        })
    })
    .catch((err)=>{
        console.log(err);
        res.redirect("back");
    });
});
router.put("/:comment_id", middleware.checkCommentOwnership, (req,res)=>{
    Comment.updateOne({_id: req.params.comment_id}, req.body.comment)
    .then(()=>{
        res.redirect(`/campgrounds/${req.params.id}`);
    })
    .catch((err)=>{
        console.log(err);
        res.redirect("back");
    })
});
router.delete("/:comment_id", middleware.checkCommentOwnership, (req,res)=>{
    Comment.deleteOne({_id: req.params.comment_id})
    .then(()=>{
        res.redirect(`/campgrounds/${req.params.id}`);
    })
    .catch((err)=>{
        console.log(err);
        res.redirect("back");
    })
});




module.exports = router;