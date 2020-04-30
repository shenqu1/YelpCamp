const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


require("dotenv").config({path:'./config/keys.env'});

const app = express();

mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`connected to MongoDB`);
})
.catch(err=>console.log(`Error while connecting to mongoDB ${err}`));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "Mountain Goat's Rest",
//     image: "https://pixabay.com/get/57e8d1454b56ae14f1dc84609620367d1c3ed9e04e5074417d2d7fdd914cc2_340.jpg"
//     })
//     .then((campground)=>{
//         console.log("Newly created campground: ");
//         console.log(campground);
//     })
//     .catch(err=>console.log(err));

app.get("/", (req, res)=>{
    res.render("landing");
});

app.get("/campgrounds", (req,res)=>{

    Campground.find()
    .then((campgrounds)=>{
        const filteredCampgrounds = campgrounds.map(campground=>{
            return{
                id: campground._id,
                name: campground.name,
                image: campground.image
            }
        });
        res.render("campgrounds", {
            campgrounds: filteredCampgrounds
        });
    })
    .catch(err=>console.log(err));
});

app.post("/campgrounds", (req,res)=>{
    const newCampground = {
        name: req.body.name, 
        image: req.body.image
    };
    const campground = new Campground(newCampground);
    campground.save()
    .then(()=>{
        res.redirect("/campgrounds");
    })
    .catch(err=>console.log(err));
});

app.get("/campgrounds/new", (req,res)=>{
    res.render("new");
});


const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log("The YelpCamp Server Has Started!");
});