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
const fs=require("fs")
const path=require("path")
const otpGenerator = require('otp-generator')
const crypto=require("crypto")
const cores=require("cors")
app.use(cores())
function hash(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest("hex");
}
const wlecome_page=fs.readFileSync(path.join("index.html"),"utf8")
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
    password:hash(password),
    token:token
 });
 var welcome = {
  from: process.env.MAIL,
  to: email,
  subject: 'Welcome to Chayo 💬',
  html:wlecome_page
};
await transpoter.sendMail(welcome)
  res.status(201).json({ message:"User Created!!",token:token,username:username });
}})

app.post("/login",async(req,res)=>{
  const {email,password}=req.body
  const check=await user.findOne({email:email})
  if(!loginvalid.validate(req.body).error){
  if (check){
    if (hash(password)==check.password){
      res.json({token:check.token,username:check.name,message:"ok"})
    }
    else{
      res.status(200).json({message:"password is wrong",d:check.password,})
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
app.post("/check",async(req,res)=>{
  const {email}=req.body
  const check= await user.findOne({email:email})
  if(check){
    res.send({username:check.name,token:check.token,message:"login"})
  }
  else{
    res.send({message:"sign"})
  }
})
app.post("/firebase",async (req,res)=>{
  const {username,password,email,photo}=req.body
  const check=await user.findOne({name:username})
    if (check){
      res.send("username taken")
    }
  else{
    const token =jwt.sign(req.body,process.env.JWT)
    await user.create({
      name:username,
      email:email,
      password:hash(password),
      token:token,
      photo:photo
   });
   var welcome = {
    from: process.env.MAIL,
    to: email,
    subject: 'Welcome to Chayo 💬',
    html:wlecome_page
  };
  await transpoter.sendMail(welcome)
  res.send({username:username,token:jwt.sign(req.body,process.env.JWT),message:"sign"})
  }}
)
app.post("/otp",async(req,res)=>{
const otp=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });   
    var mailOptions = {
      from: "mohanavamsi16@outlook.com",
      to: req.body.email,
      subject: 'Your otp '+otp,
      html: '<h1>Hey welcome</h1> <p>Here is your otp </p>'+`<h2> '${otp}'</h2>`
    };
    await transporter.sendMail(mailOptions)
    console.log("sended")
    res.send(hash(otp))
})
app.post("/otpvalid",async (req,res)=>{
  const otp=req.body.userotp
  const hasedotp=req.body.otp
  if (hash((otp))==hasedotp){
      const update=await user.findOneAndUpdate({email:req.body.email},{password:hash(req.body.password)})
      console.log(update)
      if (!update){
          res.send("user not in database")
      }
      else{
      res.send("done")
      }
  }
  else{
      res.send("notvalid")
  }
})

app.put("/update/:id",async (req,res)=>{
    res.send("route to update")
})
app.delete("/delete/:id",async(req,res)=>{
    res.send("route to delete")
})
app.get("/users",async(req,res)=>{
  const users=await user.find({})
  res.status(200).json(users)
})
// Post request will  be done in socket connection
module.exports=app
