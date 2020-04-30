const express = require("express");
const bodyParser = require("body-parser");


const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const campgrounds = [
    {name: "Salmon Crek", image: "https://pixabay.com/get/50e9d4474856b10ff3d8992ccf2934771438dbf85254794174297bd69349_340.jpg"},
    {name: "Granite Hill", image: "https://pixabay.com/get/57e0d6424b56ad14f1dc84609620367d1c3ed9e04e5074417d2e7dd49549c1_340.jpg"},
    {name: "Mountain Goat's Rest", image: "https://pixabay.com/get/52e8d4444255ae14f1dc84609620367d1c3ed9e04e5074417d2e7dd49549c1_340.jpg"},
    {name: "Salmon Crek", image: "https://pixabay.com/get/50e9d4474856b10ff3d8992ccf2934771438dbf85254794174297bd69349_340.jpg"},
    {name: "Granite Hill", image: "https://pixabay.com/get/57e0d6424b56ad14f1dc84609620367d1c3ed9e04e5074417d2e7dd49549c1_340.jpg"},
    {name: "Mountain Goat's Rest", image: "https://pixabay.com/get/52e8d4444255ae14f1dc84609620367d1c3ed9e04e5074417d2e7dd49549c1_340.jpg"},
    {name: "Salmon Crek", image: "https://pixabay.com/get/50e9d4474856b10ff3d8992ccf2934771438dbf85254794174297bd69349_340.jpg"},
    {name: "Granite Hill", image: "https://pixabay.com/get/57e0d6424b56ad14f1dc84609620367d1c3ed9e04e5074417d2e7dd49549c1_340.jpg"},
    {name: "Mountain Goat's Rest", image: "https://pixabay.com/get/52e8d4444255ae14f1dc84609620367d1c3ed9e04e5074417d2e7dd49549c1_340.jpg"}
];

app.get("/", (req, res)=>{
    res.render("landing");
});

app.get("/campgrounds", (req,res)=>{
    
    res.render("campgrounds", {
        campgrounds: campgrounds
    });

});

app.post("/campgrounds", (req,res)=>{
    const name =req.body.name;
    const image = req.body.image;
    const newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req,res)=>{
    res.render("new");
});


const PORT = 3000;
app.listen(PORT, ()=>{
    console.log("The YelpCamp Server Has Started!");
});