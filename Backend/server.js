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
const users = require("./Model/user");
app.use("/", route);

app.get("/", (req, res) => {
    res.send("Welcome to chayo");
});

app.use(cors());

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

        socket.on("connect_room", async (route,route2,other,useer) => {
            try {
                socket.join(route);
                const check1=await users.findOne({name:useer})
                check1.online=route2
                console.log(check1.unreadMessages)
                if (check1.unreadMessages){
                check1.unreadMessages= check1.unreadMessages.filter((i)=>{return i!=other})
                }
                await check1.save()
                const check = await singlemessanger.findOne({ roomid: route });
                if (check) {
                    console.log("user entering room:", route)
                } else {
                    await singlemessanger.create({
                        roomid: route,
                        messages: [{
                            user: "chayo",
                            message:"welcome to" + route,
                            time: Date.now()
                        }]
                    });
                    console.log("new room created", route)
                }
            } catch (error) {
                console.log("Error in connecting_room:", error)
            }
        });
        socket.on("typing",(user,route)=>{
            console.log(user,route)
            io.to(route).emit("typeing",user)
        })
        socket.on("singleMessage",async (message ,user,route1,route2,photo,type)=>{
            try {
                console.log(type,"ERgre")
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
                const check1=await users.findOne({name:other})
                console.log(check1,route2)
                if (check1.online!=route1){
                    check1.unreadMessages.push(user)
                    console.log(check1.unreadMessages)
                    await check1.save()
                }
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
            socket.on("disconnect",async()=>{
                const check1=await users.findOne({name:user})
                check1.online="false"
                await check1.save()
            })
        })
        socket.on("message", async (message, route, user, photo, type) => {
            try {
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
    socket.on("disconnect", () => {
        try {
            const room = Object.keys(socket.rooms).find(room => room !== socket.id);
            if (room) {
                if (roomUsers[room]) {
                    roomUsers[room] = roomUsers[room].filter(u => u.name !== user);
                    // Emit updated user list to all clients in the room
                    io.to(room).emit("userList", roomUsers[room]);
                }
            }
        } catch (error) {
            console.log("Error on disconnect:", error);
        }
    });
});

server.listen(PORT, () => {
    connect()
    console.log(`server running in ${PORT}`)
});
