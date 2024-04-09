const express=require("express")
const http=require("http")
const cors=require("cors")
const socketio=require("socket.io")
const app=express()
const server=http.createServer(app)
const io=socketio(server,{cors:{origin:"*"}})
const jwt=require("jsonwebtoken")
const {connect}=require("./db/connect")
const PORT=process.env.PORT || 6000
app.get("/",(req,res)=>{
    res.send("Welcome to chayo")
})
app.listen(PORT,()=>{
    connect()
    console.log(`server running in ${PORT}`)
})