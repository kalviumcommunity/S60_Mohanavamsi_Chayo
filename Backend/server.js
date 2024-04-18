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
app.use(cors())
io.on("connection",(socket)=>{
    try{
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
    socket.on("connecting_room", (route) => {
        socket.join(route);
        console.log("User joined room:", route);
    });
    socket.on("message", async (message, route, user, photo) => {
        console.log(message)
        io.to(route).emit("show", message, user, photo);
        await messanger.findOneAndUpdate({ roomid: route }, {
            $push: {
                messages: {
                    user: user,
                    message: message,
                    time: Date.now(),
                    message_id: 9
                }
            }
        });
    });

}
catch(er){
    console.log(er)
}}
)
server.listen(PORT,()=>{
    connect()
    console.log(`server running in ${PORT}`)
})
