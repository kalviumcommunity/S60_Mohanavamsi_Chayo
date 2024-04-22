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
