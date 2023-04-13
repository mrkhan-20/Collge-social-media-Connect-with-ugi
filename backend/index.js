const express = require("express");
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const userRouter = require("./router/user");
const PostRouter = require("./router/Post")
const cors = require("cors");
const socket=require("socket.io");
dotenv.config();

//admin
const session = require('express-session');
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))




mongoose.connect(process.env.MONGODB).then(()=>
console.log("DB connection successfull")).catch(()=>{
          console.log("Some error occured")
})
app.use(cors());
app.use(express.json());
app.use("/api/user" , userRouter);
app.use("/api/post" , PostRouter )

const server=app.listen(5000 , ()=>{
          console.log("Server is running")
})

const io=socket(server,{
    cors:{
        origin:"http://localhost:3000",
        credentails:true
    }
})

global.onlineUsers=new Map();
io.on("connection",(socket)=>{
    global.chatsocket=socket;
    socket.on("addUser",(id)=>{
        onlineUsers.set(id,socket.id);
    })

    socket.on("send-msg",(data)=>{
        const sendUserSocket=onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve",data.message);
        } 
    })
})


//admin
const User = require("./Modals/User");
const Post = require("./Modals/Post");

app.get("/admin",(req,res)=>{
    if(!req.session.is_logged_in)
    {
        res.render("adminLogin",{error:""});
        return;
    }
    res.render("adminPage");
})

app.post("/admin",(req,res)=>{
    // console.log(req.body.email);
    if(req.body.email=="admin@gmail.com" && req.body.password=="admin")
    {
        req.session.is_logged_in=true;
        res.redirect("/admin");
    }
    else{
        res.render("adminLogin",{error:"Wrong Credentials"});
    }
})


app.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/admin");
})

app.get("/verifyUsersPage",async (req,res)=>{
    if(!req.session.is_logged_in)
    {
        res.redirect("/admin");
        return;
    }

    try{
        let unverifiedUsers=await User.find({verifed:false});
        // console.log(unverifiedUsers);
        unverifiedUsers.reverse();
        res.render("verifyUsersPage",{users:unverifiedUsers});
        
    }
    catch(error)
    {
        console.log(error);

    }


})

app.post("/verifyUser",async (req,res)=>{
    if(!req.session.is_logged_in)
    {
        res.send("Not Logged In");
        return;
    }
    // console.log(req.body);
    try{
        let result=await User.updateOne({_id:req.body.id},{verifed:true});
        // console.log(result);
        if(result.acknowledged)
        {
            res.send({res:"success"});
        }
        else{
            res.send({res:"error"});
        }
    }
    catch(error)
    {
        console.log(error)
        res.send({res:error.message});
    }
})


app.post("/unverifyUser",async (req,res)=>{
    if(!req.session.is_logged_in)
    {
        res.send("Not Logged In");
        return;
    }
    // console.log(req.body);
    try{
        let result=await User.updateOne({_id:req.body.id},{verifed:false});

        let res1=await Post.deleteMany({user:req.body.id})
        // console.log(result);
        if(result.acknowledged)
        {
            res.send({res:"success"});
        }
        else{
            res.send({res:"error"});
        }
    }
    catch(error)
    {
        console.log(error)
        res.send({res:error.message});
    }
})


app.post("/deleteUser",async (req,res)=>{
    if(!req.session.is_logged_in)
    {
        res.send("Not Logged In");
        return;
    }
    // console.log(req.body);
    try{
        let result=await User.deleteOne({_id:req.body.id});

        let res1=await Post.deleteMany({user:req.body.id})
        // console.log(result);
        if(result.acknowledged)
        {
            res.send({res:"success"});
        }
        else{
            res.send({res:"error"});
        }
    }
    catch(error)
    {
        console.log(error)
        res.send({res:error.message});
    }
})

//posts
app.get("/allPosts",async (req,res)=>
{

    if(!req.session.is_logged_in)
    {
        res.redirect("/admin");
        return;
    }
    
    try{
        let allposts=await Post.find();
        allposts.reverse();
        let allusers=await User.find();

        let data=[];


        for(let i=0;i<allposts.length;i++)
        {
            for(let j=0;j<allusers.length;j++)
            {
                if(allposts[i].user.toString()===allusers[j]._id.toString())
                {

                    let curr={};
                    curr._id=allposts[i]._id.toString();
                    curr.user=allposts[i].user.toString();
                    curr.title=allposts[i].title;
                    curr.image=allposts[i].image;
                    curr.video=allposts[i].video;
                    curr.like=allposts[i].like;
                    curr.dislike=allposts[i].dislike;
                    curr.comments=allposts[i].comments;

                    curr.username=allusers[j].username;
                    curr.email=allusers[j].email;
                    curr.profile=allusers[j].profile;
                    data.push(curr);
                    break;

                }
            }
        }

        // console.log(data);

        res.render("allPosts",{posts:data,error:""})



    }
    catch(error){
        console.log(error);
        res.render("allPosts",{posts:[],error});

    }
    // res.render("allPosts");

})


app.post("/deletePost",async (req,res)=>{
    if(!req.session.is_logged_in)
    {
        res.send("Not Logged In");
        return;
    }
    try{
        let result=await Post.deleteOne({_id:req.body.postid});
        // console.log(result);
        if(result.acknowledged)
        {
            res.send("success");
        }
        else{
            res.send("error");
        }


    }
    catch(error)
    {
        res.send(error.message);
        console.log(error);
    }
    
})


app.get("/allUsers",async (req,res)=>{
    if(!req.session.is_logged_in)
    {
        res.redirect("/admin");
        return;
    }

    try{
        let allusers=await User.find({verifed:true});
        // console.log(allusers);
        res.render("allUsers",{users:allusers,error:""})


    }
    catch(error)
    {
        console.log(error);
        res.render("allUsers",{users:[],error:error}) 
    }



})


//upadeUser

app.post("/updateUser",async (req,res)=>{
    if(!req.session.is_logged_in)
    {
        res.redirect("/admin");
        return;
    }

    try{
        let result=await User.updateOne({_id:req.body.id},{username:req.body.username,email:req.body.email,phonenumber:req.body.phone});
        // console.log(result);
        if(result.acknowledged)
        {
            res.send("success");
        }
        else{
            res.send("error");
        }

    }
    catch(error)
    {
        console.log(error);
        res.send(error.message);
    }
})

