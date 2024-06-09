import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { io } from "socket.io-client";
import { getCookie } from "./nav";
import axios from "axios";
import { FaArrowLeft } from 'react-icons/fa';
const socket = io("http://localhost:8000");

function Single(){ 
     const { roomid } = useParams()
    const chatContainerRef = useRef()
    const nav=useNavigate()
    const [messages, setMessages] = useState([{user:"vami"}])
    const [newMessage, setNewMessage] = useState("")
      useEffect(() => {
        console.log(roomid)
        socket.emit("connect_room", roomid.split("&")[0]+roomid.split("&")[1], roomid.split("&")[1]+roomid.split("&")[0],roomid.split("&")[1],getCookie("username"))
      }, [])
      useEffect(()=>{
        axios.get(`https://s60-mohanavamsi-chayo.onrender.com/singledata/${roomid.split("&").join("")}`).then(
          (res)=>{
            console.log(res.data[0])
            setMessages(res.data[0].messages)
          }
        )
      },[])
      useEffect(() => {
        scrollToBottom()
      }, [messages])
      socket.on("shows", (message, user, photo) => {
        console.log(message)
        setMessages(prevMessages => [...prevMessages, { user, message, photo }]);
    });
     function sendMessage() {
          let room=roomid.split("&")
          let route1=room[0]+room[1]
          let route2=room[1]+room[0]
          socket.emit("singleMessage",newMessage ,getCookie("username"),roomid.split("&")[1],route1,route2,getCookie("photo"))
          setNewMessage("")
        }
      
    function enter(e){
      if (e==="Enter"){
        sendMessage()
      }
    }
      function scrollToBottom(){
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    
      const isCurrentUser = (username) => {
        return username === getCookie("username");
      };

      return (
        <div className="h-screen bg-gray-950 p-2 flex flex-col justify-center items-center">
        <div className={window.outerWidth>=600 ?`overflow-y-scroll h-5/6 w-6/12 relative bottom-4 bg-black rounded-2xl pt-2 pl-2` :`overflow-y-scroll h-5/6 w-11/12 relative bottom-4 bg-black rounded-2xl pt-2 pl-2`} ref={chatContainerRef}>
          {messages.map((message, index) => (
            <div key={index} className={`flex w-full ${isCurrentUser(message.user) ? ' justify-start' : ' justify-end'} `}>
            <div  className={window.outerWidth>=600 ?`border border-gray-800 m-2 bg-gray-800  text-white w-60 relative p-3 rounded-xl shadow-xl`:`border border-gray-800 m-2 bg-gray-800  text-white relative p-3 rounded-xl shadow-xl w-6/12`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={message.photo} alt="User" className="h-8 w-8 rounded-full mr-2" />
                  <h1 className={window.outerWidth>=600?"font-semibold text-wrap text-l break-words line-clamp-2":"font-semibold text-sm text-wrap break-words line-clamp-2"}>{message.user}</h1>
                </div>
               
              </div>
              <p>{message.message}</p>
            </div>
            </div>
          ))}
        </div>
        <div className="fixed bottom-4 flex justify-center w-full">
          <textarea
            className="w-96 bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e)=>{enter(e.key)}}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg ml-4">
            Send
          </button>
        </div>
        <button onClick={() => nav("/")} className="absolute top-4 left-4 rounded-full broder border-white hover:bg-white hover:text-black text-white p-2 flex items-center">
          <FaArrowLeft className=" size-5" />
        </button>
      </div>
      );
    }
export default Single