import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Nav, { getCookie } from "./nav";
import axios from "axios";

function Home() {
    const [room, setRoom] = useState("");
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
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
        if (room.trim() != "" && getCookie("username") ) {
            socket.emit("route", room, getCookie("username") || "anonymous");
            nav(`/chat/${room}`);
        } else {
            alert("Please enter the room ID. If not logedin please login");
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
            nav(`/single/${name}&${getCookie("username")}`, { state: { status: "single" } });
        }
    }

   
    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
console.log(window.innerWidth,window.outerWidth)
  
    return (
        <div className={window.outerWidth>=600 ? `bg-gray-950 h-screen text-white flex justify-center items-center` : ` flex-col justify-around text-white bg-gray-950 w-screen`}>
            <div className={window.outerWidth>=600 ?`flex justify-center absolute top-4`:`flex mb-52 justify-center`}>
                <Nav/>
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
                    className="w-32 p-2 rounded-3xl border border-white hover:bg-white hover:text-black text-white "
                    onClick={routeCreator}
                >
                    Chat!
                </button>
            </div> 
            <div className={window.outerWidth>=600  ? `overflow-y-scroll absolute left-2 flex flex-col h-screen` : `overflow-y-scroll flex flex-col h-screen`}>
                <h1 className="text-5xl mt-8 text-center">Users</h1>
                <input
                    type="text"
                    placeholder="Search users..."
                    className="m-6 p-2 h-10 rounded-xl focus:bg-black focus:text-white text-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex flex-col items-center mt-4 p-3">
                    {filteredUsers.map((user, index) => (
                        <div
                            key={index}
                            className="flex items-center w-80 border border-white shadow-md shadow-white p-2 mt-4 cursor-pointer transition duration-300 ease-in-out hover:bg-white hover:text-black rounded-xl"
                            onClick={() => handleUserClick(user.name)}
                        >
                            <img
                                src={user.photo}
                                alt={user.name}
                                className="w-16 h-16 rounded-full mr-4"
                            />
                            <div className="flex flex-col">
                                <h1 className="text-3xl">{user.name}</h1>
                            </div>
                        </div>
                    ))}
                </div>
            </div>         
               
            </div>
        
    );
}

export default Home;
