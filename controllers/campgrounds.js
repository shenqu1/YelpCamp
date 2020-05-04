const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

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
                campgrounds: filteredCampgrounds
            });
        })
        .catch(err => console.log(err));
});

router.post("/", isLoggedIn, (req, res) => {
    const newCampground = {
        name: req.body.name,
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

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.get("/:id", (req, res) => {

    Campground.findById(req.params.id).populate("comments").exec()
        .then((campground) => {
            res.render("campgrounds/show", {
                campground
            });
        })
        .catch(err => console.log(err));
});

router.get("/:id/edit", checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id)
        .then((campground) => {
            res.render(("campgrounds/edit"), {
                campground
            });
        })
        .catch(err => console.log(err));
});

router.put("/:id", checkCampgroundOwnership, (req, res) => {
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

router.delete("/:id", checkCampgroundOwnership, (req, res) => {
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id)
            .then((campground) => {
                if (campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            })
            .catch(err => console.log(err));
    } else {
        res.redirect("back");
    }
}

module.exports = router;