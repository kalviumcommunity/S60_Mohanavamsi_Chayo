import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Nav, { getCookie } from "./nav";
import axios from "axios";

function Home() {
    const [room, setRoom] = useState("");
    const [users, setUsers] = useState([]);
    const socket = io("https://s60-mohanavamsi-chayo.onrender.com");
    const nav = useNavigate();

    useEffect(() => {
        axios.get("https://s60-mohanavamsi-chayo.onrender.com/users")
            .then((res) => {
                setUsers(res.data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }, []);

    function routeCreator() {
        if (room.trim() !== "") {
            socket.emit("route", room, getCookie("username") || "anonymous");
            nav(`/chat/${room}`, { state: { room } });
        } else {
            alert("Please enter the room ID.");
        }
    }

    function handleChange(e) {
        const { value } = e.target;
        setRoom(value);
    }

    function handleUserClick(name) {
        if (name === getCookie("username")) {
            alert("You can't chat with yourself!");
        } else if (getCookie("username")) {
            nav(`/chat/${name + getCookie("username")}`);
        }
    }

    return (
        <div className="bg-gray-950 h-screen text-white flex flex-col justify-center items-center">
            <div className="flex justify-center absolute top-4">
                <Nav />
            </div>
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-5xl">Chayo</h1>
                <input
                    placeholder="Create or join a room!"
                    className="m-6 p-2 h-10 rounded-xl focus:bg-black focus:text-white text-black"
                    name="route"
                    value={room}
                    onChange={handleChange}
                />
                <button
                    className="w-32 p-2 rounded-3xl border border-white hover:bg-white hover:text-black text-white"
                    onClick={routeCreator}
                >
                    Chat!
                </button>
            </div>
            <h1 className="text-5xl mt-8">Users</h1>
            <div className="flex flex-col items-center mt-4  overflow-scrolli">
                {users.map((user, index) => (
                    <div key={index} className="w-56 border border-white shadow-md shadow-white p-2 mt-4 cursor-pointer">
                        <h1 className="text-3xl" onClick={() => handleUserClick(user.name)}>{user.name}</h1>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
