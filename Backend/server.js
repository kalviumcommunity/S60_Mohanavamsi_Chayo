const express=require("express")
const http=require("http")
const cors=require("cors")
const socketio=require("socket.io")
const app=express()
const server=http.createServer(app)
const io=socketio(server,{cors:{origin:"*"}})
const jwt=require("jsonwebtoken")
const route=require("./Routes/routes")
const {connect}=require("./db/connect")
const PORT=process.env.PORT || 8000
app.use("/",route)
app.get("/",(req,res)=>{
    res.send("Welcome to chayo")
})
io.on("connection",(socket)=>{
    socket.on("test",(name)=>{
        console.log("vamsi")
        socket.emit("rev",name)
    })
})
server.listen(PORT,()=>{
    connect()
    console.log(`server running in ${PORT}`)
})