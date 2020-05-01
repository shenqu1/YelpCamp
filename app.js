const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
Campground = require("./models/campground");
Comment = require("./models/comment");

seedDB = require("./seeds");

seedDB();


require("dotenv").config({path:'./config/keys.env'});

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`connected to MongoDB`);
})
.catch(err=>console.log(`Error while connecting to mongoDB ${err}`));





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
        res.render("campgrounds/index", {
            campgrounds: filteredCampgrounds
        });
    })
    .catch(err=>console.log(err));
});

app.post("/campgrounds", (req,res)=>{
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

app.get("/campgrounds/new", (req,res)=>{
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", (req,res)=>{

    Campground.findById(req.params.id).populate("comments").exec()
    .then((campground)=>{
        res.render("campgrounds/show", {
            campground
        });
    })
    .catch(err=>console.log(err));
});

app.get("/campgrounds/:id/comments/new", (req,res)=>{
    Campground.findById(req.params.id)
    .then((campground)=>{
        res.render("comments/new", {campground});
    })
    .catch(err=>console.log(err));

});

app.post("/campgrounds/:id/comments", (req,res)=>{
    Campground.findById(req.params.id)
    .then((campground)=>{
        Comment.create(req.body.comment)
        .then((comment)=>{
            campground.comments.push(comment);
            campground.save()
            .then(()=>{
                res.redirect(`/campgrounds/${campground._id}`);
            })
            .catch(err=>console.log(err));
        })
        .catch(err=>console.log(err));
    })
    .catch((err)=>{
        console.log(err);
        res.redirect("/campgrounds");
    });
});


const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log("The YelpCamp Server Has Started!");
});