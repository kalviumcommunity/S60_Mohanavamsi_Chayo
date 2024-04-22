const express = require("express");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");
const bad=require("bad-words")
const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });
const messanger = require("./Model/chat");
const route = require("./Routes/routes");
const { connect } = require("./db/connect");
const PORT = process.env.PORT || 8000;
const filter=new bad({placeHolder:"😇"})

app.use("/", route);

app.get("/", (req, res) => {
    res.send("Welcome to chayo");
});

app.use(cors());

io.on("connection", (socket) => {
    try {
        socket.on("route", async (route, user) => {
            try {
                const check = await messanger.findOne({ roomid: route });
                if (check) {
                    console.log("user entering room:", route);
                } else {
                    await messanger.create({
                        roomid: route,
                        messages: [{
                            user: user,
                            message: user + " joined",
                            time: Date.now()
                        }]
                    });
                    console.log("new room created", route);
                }
            } catch (error) {
                console.error("Error in route:", error);
            }
        });

        socket.on("connecting_room", (route) => {
            try {
                socket.join(route);
            } catch (error) {
                console.log("Error in connecting_room:", error);
            }
        });
        socket.on("connect_room",async (route1,route2)=>{
            try {
                const check1 = await messanger.findOne({ roomid: route1 });
                if (check1) {
                    console.log("user entering room:", route2);
                } else {
                    await messanger.create({
                        roomid: route1,
                        messages: [{
                            user: "chayoo",
                            message: "chayoo" + " joined",
                            time: Date.now()
                        }]
                    });
                    console.log("new room created", route1);
                }
                const check2 = await messanger.findOne({ roomid: route2 });
                if (check2) {
                    console.log("user entering room:", route2);
                } else {
                    await messanger.create({
                        roomid: route2,
                        messages: [{
                            user: "chayoo",
                            message: "chayoo" + " joined",
                            time: Date.now()
                        }]
                    });
                    console.log("new room created", route2);
                }
            }
            catch (error) {
                console.error("Error in route:", error);
            }
            socket.join(route1)
            socket.join(route2)
        })
        socket.on("singleMessage",async (message ,user,route1,route2,photo)=>{
            try {
                let filteredmessage=filter.clean(message)
                console.log(message);
                io.to(route1).emit("show", filteredmessage, user, photo);
                io.to(route2).emit("show", filteredmessage, user, photo);
                await messanger.findOneAndUpdate({ roomid: route1 }, {
                    $push: {
                        messages: {
                            user: user,
                            message: message,
                            time: Date.now()
                        }
                    }
                });
                await messanger.findOneAndUpdate({ roomid: route2 }, {
                    $push: {
                        messages: {
                            user: user,
                            message: message,
                            time: Date.now()
                        }
                    }
                });
            } catch (error) {
                console.log("Error in message:", error);
            }
        })
        socket.on("message", async (message, route, user, photo) => {
            try {
                let filteredmessage=filter.clean(message)
                console.log(message);
                io.to(route).emit("show", filteredmessage, user, photo);
                await messanger.findOneAndUpdate({ roomid: route }, {
                    $push: {
                        messages: {
                            user: user,
                            message: message,
                            time: Date.now()
                        }
                    }
                });
            } catch (error) {
                console.log("Error in message:", error);
            }
        });
    } catch (error) {
        console.log("Error in connection:", error);
    }
});

server.listen(PORT, () => {
    connect();
    console.log(`server running in ${PORT}`);
});
