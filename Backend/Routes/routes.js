const express=require("express")
const http=require("http")
const socketio=require("socket.io")
const app=express()
const server=http.createServer(app)
const messanger=require("../Model/chat")
const user=require("../Model/user")
const nodemailer=require("nodemailer")
const env=require("dotenv")
const jwt=require("jsonwebtoken")
const cors=require("cors")
const Joi=require("joi")
const signvalid=Joi.object({
  username:Joi.string().required(),
  email:Joi.string().email(),
  password:Joi.string().required()
})
const loginvalid=Joi.object({
  email:Joi.string().email(),
  password:Joi.string().required()
})
env.config()
app.use(express.json())
app.use(cors())
const transpoter=nodemailer.createTransport({
    service:"outlook",
     auth: {
        user: "mohanavamsi16@outlook.com",
        pass: process.env.PASS,
      }
    })
app.post("/testmail",async (req,res)=>{
    var welcome = {
        from: "mohanavamsi16@outlook.com",
        to: req.body.mail,
        subject: 'Welcome',
        html: '<h1>Hey welcome to chayo</h1>'
      };
      await transpoter.sendMail(welcome)
      res.send("done")
})
app.post("/sign",async(req,res)=>{
  const {email,password,username}=req.body
  const check=await user.findOne({email:email})
  const check2=await user.findOne({name:username})
  if(check){
    res.json({message:"User in database please login."})
  }
  else if(check2){
    res.json({message:"username already taken."})
  }
  else if (signvalid.validate(req.body).error){
    res.json({message:signvalid.validate(req.body).error.message})
  }
  else{
  const token=jwt.sign(req.body,process.env.JWT)
  await user.create({
    name:username,
    email:email,
    password:password,
    token:token
 });
  res.status(201).json({ message:"User Created!!",token:token,username:username });
}})

app.post("/login",async(req,res)=>{
  const {email,password}=req.body
  const check=await user.findOne({email:email})
  if(!loginvalid.validate(req.body).error){
  if (check){
    if (password==check.password){
      res.json({token:check.token,username:check.name,message:"ok"})
    }
    else{
      res.status(200).json({message:"password is wrong"})
    }
  }
  else{
    res.json({message:"user not in database"})
  }
}
else{
  res.json({message:loginvalid.validate(req.body).error.message})
}
})
app.get("/data/:roomid",async (req,res)=>{
    const roomdata=await messanger.find({roomid:req.params.roomid})
    res.status(200).json(roomdata)
})
app.put("/update/:id",async (req,res)=>{
    console.log(req.body)
    res.send("route to update")
})
app.delete("/delete/:id",async(req,res)=>{
    res.send("route to delete")
})

// Post request will  be done in socket connection
module.exports=app
