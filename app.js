var express     = require("express");
var http = require("http");
const expressSanitizer = require("express-sanitizer");
    ejs         = require("ejs");
    app         = express();
    authRoutes = require('./routes/authRoutes');
    bodyParser  = require('body-parser');
    cookieParser = require('cookie-parser');
    mongoose    = require("mongoose");
    metoverride = require("method-override");
    expresanitiz= require("express-sanitizer");
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
// mongodb+srv://Mrityunjaya:MongoDB9V@cluster0.gznsa.mongodb.net/Mrityunjaya 
//mongodb://localhost:27017/test 
const dbURI = 'mongodb+srv://Mrityunjaya:MongoDB9V@cluster0.gznsa.mongodb.net/Mrityunjaya ';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
    .then((result) => console.log("Server is running..."))
    .catch((err) => console.log(err));
app.set("view engine","ejs");
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/css',express.static('css'));
app.use(metoverride("_method"));
app.use(express.json());
app.use(cookieParser());


//SCEMA SETUP
var campground = mongoose.model('campground', { 
    name: String ,
    UserName: String,
    image: String,
    views: 0,
    hearts: 0,
    description: String,
    created: {type:Date, default: Date.now}
});

// function(err,campground){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("new camp ground added");
//         console.log(campground);
//     }
// });
app.get('*', checkUser);
app.get("/",function(req,res){
    campground.find({},function(err,campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("index",{campground : campgrounds});
        }
    });
});
app.get("/intro",function(req,res){
    res.render("intro");
});
app.get("/asmember",function(req,res){
    res.render("asmember");
});
app.get("/asprofessnal",function(req,res){
    res.render("asprofessnal");
});
app.get("/asvolunteer",function(req,res){
    res.render("asvolunteer");
});
app.get("/contactUs",function(req,res){
    res.render("contactus");
});
app.get("/campground", function(req,res){
    //get campround from db
    campground.find({},function(err,campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campground",{campground : campgrounds});
        }
    });
    //res.render("campground",{campground : campgrounds});    
});

app.post("/campground",function(req,res){
    var image = req.body.image;
    var name = req.body.name;
    var description = req.body.description;
    var UserId = req.body.UserId;
    campground.create({
        name:name, 
        image: image,
        description: description,
        UserId: UserId,
    },
    function(err,campground){
        if(err){
            console.log(err);
        }else{
            console.log("new camp ground added");
            res.redirect("/campground");
        }
    });    
});
app.get("/new", requireAuth ,function(req,res){
    res.render("new.ejs");
});
app.get("/campground/:id",function(req,res){
    campground.findById(req.params.id,function(err,foundcampground){
        if(err){
            console.log(err);
        } else{
            res.render("show",{campground: foundcampground});
            console.log(foundcampground);
        }
    });
    ////res.render("show.ejs");
});
app.get("/campground/:id/edit", requireAuth ,function(req,res){
    campground.findById(req.params.id,function(err,foundcampground){
        if(err){
            console.log(err);
        } 
        else{
            res.render("edit",{campground: foundcampground});
            console.log(foundcampground);
        }
    });
})
app.put("/campground/:id",function(req,res){
    campground.findByIdAndUpdate(req.params.id ,req.body.campground,function(err, updatedCampground){
        if(err){
            res.redirect("/campground");
        }
        else{
            res.redirect("/campground/"+ req.params.id);
        }
    })  ; 
});
app.delete("/campground/:id", requireAuth ,function(req,res){
    campground.findByIdAndRemove(req.params.id ,function(err){
        if(err){
            res.redirect("/campground/"+ req.params.id);
        }
        else{
            res.redirect("/campground"); 
        }
    });
});
app.use(authRoutes);

app.listen(process.env.PORT || 3003, 
    () => console.log(""))