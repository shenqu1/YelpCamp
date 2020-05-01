const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const data = [
    {
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam expedita amet neque. Neque corrupti facere omnis provident architecto saepe similique maiores id a fugit, asperiores beatae, sunt voluptate possimus nisi."
    },
    {
        name: "Desert Mesa",
        image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam expedita amet neque. Neque corrupti facere omnis provident architecto saepe similique maiores id a fugit, asperiores beatae, sunt voluptate possimus nisi."
    },
    {
        name: "Canyan Floor",
        image: "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam expedita amet neque. Neque corrupti facere omnis provident architecto saepe similique maiores id a fugit, asperiores beatae, sunt voluptate possimus nisi."
    }
]

function seedDB(){
    Campground.deleteMany()
    .then(()=>{
        console.log("removed campgrounds");
        data.forEach((seed)=>{
            Campground.create(seed)
            .then((campground)=>{
                console.log("added a campground");
                Comment.create({
                    text: "This place is great, but I wish there was internet",
                    author: "Homer"
                })
                .then((Comment)=>{
                    campground.comments.push(Comment);
                    campground.save()
                    .then(()=>{
                        console.log("Created new comment");
                    })
                    .catch(err=>console.log(err));
                })
                .catch(err=>console.log(err));
            })
            .catch(err=>console.log(err));
        });
    })
    .catch(err=>console.log(err));
}

module.exports = seedDB;

