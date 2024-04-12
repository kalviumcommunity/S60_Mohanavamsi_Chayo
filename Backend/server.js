const express=require("express")
const http=require("http")
const cors=require("cors")
const socketio=require("socket.io")
const app=express()
const server=http.createServer(app)
const io=socketio(server,{cors:{origin:"*"}})
const jwt=require("jsonwebtoken")
const messanger=require("./Model/chat")
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
    socket.on("route",async (route,user)=>{
        const check=await messanger.findOne({roomid:route})
        if (check){
            console.log("user entering room:",route)
        }
        else{
            await messanger.create({
                roomid: route,
                messages: [{
                    user: user,
                    message: user + " joined",
                    time: Date.now()
                }]
            });
            console.log("new room created",route)
        }
    })
})
server.listen(PORT,()=>{
    connect()
    console.log(`server running in ${PORT}`)
})
