const express = require("express");
const router = express.Router();
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

const geocoder = NodeGeocoder(options);
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

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      var lat = data[0].latitude;
      var lng = data[0].longitude;
      var location = data[0].formattedAddress;
      var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
      // Create a new campground and save to DB
      Campground.create(newCampground, function(err, newlyCreated){
          if(err){
              console.log(err);
          } else {
              //redirect back to campgrounds page
              console.log(newlyCreated);
              res.redirect("/campgrounds");
          }
      });
    });
  });

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.get("/:id", (req, res) => {

    Campground.findById(req.params.id).populate("comments").exec()
        .then((campground) => {
            if (!campground) {
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            } else {
                res.render("campgrounds/show", {
                    campground
                });
            }
        })
        .catch((err) => {
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

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      req.body.campground.lat = data[0].latitude;
      req.body.campground.lng = data[0].longitude;
      req.body.campground.location = data[0].formattedAddress;
  
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              req.flash("success","Successfully Updated!");
              res.redirect("/campgrounds/" + campground._id);
          }
      });
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