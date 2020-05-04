const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

router.get("/", (req, res) => {

    Campground.find()
        .then((campgrounds) => {
            const filteredCampgrounds = campgrounds.map(campground => {
                return {
                    id: campground._id,
                    name: campground.name,
                    image: campground.image
                }
            });
            res.render("campgrounds/index", {
                campgrounds: filteredCampgrounds,
                page: "campgrounds"
            });
        })
        .catch(err => console.log(err));
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    const newCampground = {
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };
    const campground = new Campground(newCampground);
    campground.save()
        .then(() => {
            res.redirect("/campgrounds");
        })
        .catch(err => console.log(err));
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.get("/:id", (req, res) => {

    Campground.findById(req.params.id).populate("comments").exec()
        .then((campground) => {
            if(!campground) {
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            } else {
                res.render("campgrounds/show", {
                    campground
                });
            }
        })
        .catch((err)=>{
            req.flash("error", "Campground not found");
            res.redirect("back");
        });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id)
        .then((campground) => {
            res.render(("campgrounds/edit"), {
                campground
            });
        })
        .catch(err => console.log(err));
});

router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.updateOne({
            _id: req.params.id
        }, req.body.campground)
        .then(() => {
            res.redirect(`/campgrounds/${req.params.id}`);
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/campgrounds");
        });
});

router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.deleteOne({
            _id: req.params.id
        })
        .then(() => {
            res.redirect("/campgrounds");
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/campgrounds");
        })
});




module.exports = router;