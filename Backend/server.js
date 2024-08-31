const express = require("express");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");
const bad=require("bad-words")
const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });
const messanger = require("./Model/chat");
const singlemessanger=require("./Model/singlechat")
const route = require("./Routes/routes");
const { connect } = require("./db/connect");
const PORT = process.env.PORT || 8000;
const filter=new bad({placeHolder:"😇"})
  
app.use("/", route);

app.get("/", (req, res) => {
    res.send("Welcome to chayo");
});

app.use(cors({origin:"https://chayoo.vercel.app"}));

const roomUsers = {};

io.on("connection", (socket) => {
    try {
        socket.on("route", async (route, user,password) => {
            try {
                const check = await messanger.findOne({ roomid: route });
                if (check) {
                    console.log("user entering room:", route);
                } else {
                   let u= await messanger.create({
                        roomid: route,
                        messages: [{
                            user: user,
                            message: user + " joined",
                            time: Date.now()
                        }],
                        password:password
                    });
                    console.log(u)
               
                    console.log("new room created", route);
                }
            } catch (error) {
                console.error("Error in route:", error);
            }
        });

        socket.on("connecting_room", async(route,photo,user) => {
            console.log(route)
            try {
                socket.join(route);
                console.log(roomUsers)
                if (!roomUsers[route]){
                    roomUsers[route]=[]
                }
                if (!roomUsers[route].some(u => u.name == user)){
                    roomUsers[route].push({name: user, photo: photo});
                    io.to(route).emit("userList", roomUsers[route]);
                }
                else{
                io.to(route).emit("userList", roomUsers[route]);
                }
            } catch (error) {
                console.log("Error in connecting_room:", error)
            }
        });

        socket.on("connect_room", async (route, route2) => {
            try {
                socket.join(route);
        
                const check = await singlemessanger.findOne({ roomid: route });
                const check2 = await singlemessanger.findOne({ roomid: route2 });
        
                if (check) {
                    console.log("User entering room:", route);
                } else {
                    await singlemessanger.create({
                        roomid: route,
                        messages: [{
                            user: "chayo",
                            message: "Welcome to " + route,
                            time: Date.now()
                        }]
                    });
                    console.log("New room created:", route);
                }
        
                if (check2) {
                    console.log("User entering second room:", route2);
                } else {
                    await singlemessanger.create({
                        roomid: route2,
                        messages: [{
                            user: "chayo",
                            message: "Welcome to " + route2,
                            time: Date.now()
                        }]
                    });
                    console.log("New second room created:", route2);
                }
        
            } catch (error) {
                console.error("Error in connecting_room:", error);
            }
        });
        socket.on("typing",(user,route)=>{
            console.log(user,route)
            io.to(route).emit("typeing",user)
        })
        socket.on("singleMessage",async (message ,user,route1,route2,photo,type)=>{
            try {
                if (type=="text"){
                let filteredmessage=filter.clean(message)
                console.log(filteredmessage)
                io.to(route1).emit("shows", filteredmessage, user, photo,type)
                io.to(route2).emit("shows", filteredmessage, user, photo,type)
                await singlemessanger.findOneAndUpdate({ roomid: route1 }, {
                    $push: {
                        messages: {
                            user: user,
                            message: filteredmessage,
                            photo:photo,
                            time: Date.now(),
                            type:type
                        }
                    }
                });
                await singlemessanger.findOneAndUpdate({ roomid: route2 }, {
                    $push: {
                        messages: {
                            user: user,
                            message: filteredmessage,
                            photo:photo,
                            time: Date.now(),
                            type:type
                        }
                    }
                });
            }
            else{
                console.log("not",type)
                io.to(route1).emit("shows", message, user, photo,type)
                io.to(route2).emit("shows", message, user, photo,type)
                await singlemessanger.findOneAndUpdate({ roomid: route1 }, {
                    $push: {
                        messages: {
                            user: user,
                            message: message,
                            photo:photo,
                            time: Date.now(),
                            type:type
                        }
                    }
                });
                console.log("ewf")
                await singlemessanger.findOneAndUpdate({ roomid: route2 }, {
                    $push: {
                        messages: {
                            user: user,
                            message: message,
                            photo:photo,
                            time: Date.now(),
                            type:type
                        }
                    }
                });
                console.log("vdsf")

            }
            } catch (error) {
                console.log("Error in message:", error)
            }
        })
        socket.on("message", async (message, route, user, photo, type) => {
            try {
                console.log(message)
                if (type=="text"){
                let filteredmessage=filter.clean(message)
                console.log(message);
                io.to(route).emit("show", filteredmessage, user, photo, type);
                io.to(route).emit("typeing","no_one")

                await messanger.findOneAndUpdate({ roomid: route }, {
                    $push: {
                        messages: {
                            user: user,
                            message: filteredmessage,
                            photo:photo,
                            time: Date.now(),
                            type:type
                        }
                    }
                });
                }
                else{
                    console.log(message)
                    io.to(route).emit("show", message, user, photo, type)
                    await messanger.findOneAndUpdate({ roomid: route }, {
                        $push: {
                            messages: {
                                user: user,
                                message: message,
                                photo:photo,
                                time: Date.now(),
                                type:type
                            }
                        }
                    });
                }
                io.to(route).emit("typeing","no_one")
               
            } catch (error) {
                console.log("Error in message:", error)
            }
        });  

    } catch (error) {
        console.log("Error in connection:", error)
    }
    app.delete("/delete/:id/:roomid", async (req, res) => {
        const roomId = req.params.roomid
        const messageId = req.params.id
        try {
           const data= await messanger.findOneAndUpdate(
                { roomid: roomId },
                { $pull: { messages: { _id: messageId } } }
            );
    
            socket.to(roomId).emit("delete", data.messages)
            res.send("done");
        } catch (error) {
            console.error("Error deleting message:", error)
            res.status(500).send("An error occurred while deleting the message.")
        }
    });
    
      
    app.put("/update/:id/:roomid", async (req, res) => {
        const roomId = req.params.roomid
        const messageId = req.params.id
        const newMessage = req.body.message
    
        try {
           const data= await messanger.findOneAndUpdate(
                { roomid: roomId, "messages._id": messageId },
                { $set: { "messages.$.message": newMessage } }
            )

            io.to(roomId).emit("update",data.messages)
            res.json("done!")
        } catch (error) {
            console.error("Error updating message:", error)
            res.status(500).send("An error occurred while updating the message.")
        }
    });
    socket.on("disconnect", () => {
        try {
            const room = Object.keys(socket.rooms).find(room => room !== socket.id);
            if (room) {
                if (roomUsers[room]) {
                    roomUsers[room] = roomUsers[room].filter(u => u.name !== user);
                    io.to(room).emit("userList", roomUsers[room]);
                }
            }
        } catch (error) {
            console.log("Error on disconnect:", error);
        }
    });
    socket.on("disconnect", () => {
       
    });
});

server.listen(PORT, () => {
    connect()
    console.log(`server running in ${PORT}`)
});