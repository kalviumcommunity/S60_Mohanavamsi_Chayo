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
    //   console.log("send")
      res.send("done")
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
