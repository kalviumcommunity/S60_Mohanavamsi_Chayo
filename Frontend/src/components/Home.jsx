import { useState } from "react";
import {useNavigate} from "react-router-dom"
import {io} from "socket.io-client"
import Nav from "./nav";
function Home() {
    const [room,setroom]=useState({})
    const socket=io("https://s60-mohanavamsi-chayo.onrender.com")
    const nav=useNavigate()
    function roteCreator() {
        if (Object.keys(room).length==1){
        socket.emit("route",room.route)
        nav(`/chat/${room.route}`,{state:room})
        }
        else{
            alert('Please enter the roomid.');
        }
    }
    function change(e){
        const {name,value}=e
        setroom({[name]:value})
    }
    return(
        <div className=" bg-gray-950 h-screen text-white flex flex-col justify-center items-center">
 <div className=" flex justify-center absolute top-4">
        <Nav/>
        </div>        <h1 className=" text-5xl">Chayo</h1>
            <input placeholder="Create or join a room!" 
             className=" m-6 p-2 h-10 rounded-xl focus:bg-black focus:text-white text-black"
              name="route" 
              onChange={(e)=>{change(e.target)}}/>
              <button className="  w-32 p-2 rounded-3xl border border-white hover:bg-white hover:text-black text-white" onClick={roteCreator}>Chat!</button>
        <hr/>
        <h1 className=" text-5xl relative top-56">Users</h1>
        </div>
    )
}
export default Home;