const express= require("express");
const router = express.Router();
const Campground = require("../models/campground");

router.get("/", (req,res)=>{

    Campground.find()
    .then((campgrounds)=>{
        const filteredCampgrounds = campgrounds.map(campground=>{
            return{
                id: campground._id,
                name: campground.name,
                image: campground.image
            }
        });
        res.render("campgrounds/index", {
            campgrounds: filteredCampgrounds
        });
    })
    .catch(err=>console.log(err));
});

router.post("/", (req,res)=>{
    const newCampground = {
        name: req.body.name, 
        image: req.body.image,
        description: req.body.description
    };
    const campground = new Campground(newCampground);
    campground.save()
    .then(()=>{
        res.redirect("/campgrounds");
    })
    .catch(err=>console.log(err));
});

router.get("/new", (req,res)=>{
    res.render("campgrounds/new");
});

router.get("/:id", (req,res)=>{

    Campground.findById(req.params.id).populate("comments").exec()
    .then((campground)=>{
        res.render("campgrounds/show", {
            campground
        });
    })
    .catch(err=>console.log(err));
});

module.exports = router;