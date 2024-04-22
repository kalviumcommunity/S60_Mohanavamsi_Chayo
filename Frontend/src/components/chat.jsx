import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router";
import { io } from "socket.io-client";
import { getCookie } from "./nav";
import axios from "axios";

const socket = io("https://s60-mohanavamsi-chayo.onrender.com");

function Chat() {
  const { roomid } = useParams()
  const chatContainerRef = useRef()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  useEffect(() => {
    socket.emit("connecting_room", roomid)
  }, [])
  useEffect(()=>{
    axios.get(`https://s60-mohanavamsi-chayo.onrender.com/data/${roomid}`).then(
      (res)=>{
        console.log(res.data[0].messages)
        setMessages(res.data[0].messages)
      }
    )
  },[])
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  socket.on("show", (message, user, photo) => {
    setMessages([...messages, { user: user, message: message, photo: photo }])
  });
  function sendMessage() {
    if(roomid.includes("single")){
      let room=roomid.split("&")
      let route1=room[0]+room[1]
      let route2=room[1]+room[0]
      socket.emit("singleMessage",newMessage ,getCookie("username"),route1,route2,getCookie("photo"))
      setNewMessage("")
    }
    else{
    if (newMessage.trim() != ""){
    socket.emit("message", newMessage, roomid, getCookie("username"),getCookie("photo"))
    setNewMessage("")
    }
  }}
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
      <div className="overflow-y-scroll h-5/6 w-6/12 relative bottom-4 bg-black rounded-2xl pt-2 pl-2" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div key={index} className={`border border-gray-800 m-2 bg-gray-800 ${isCurrentUser(message.user) ? 'ml-2' : 'ml-96'} text-white w-56 relative p-3 rounded-xl shadow-xl`}
          >
            <div className="flex items-center">
              <img src={message.photo} alt="User" className="h-6 w-6 rounded-full mr-2" />
              <h1 className="font-semibold">{message.user}</h1>
            </div>
            <p>{message.message}</p>
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
    </div>
  );
}

export default Chat;
