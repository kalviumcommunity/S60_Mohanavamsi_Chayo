import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router"; 
import { io } from "socket.io-client";
import { getCookie } from "./nav";
import axios from "axios";
import { FaArrowLeft } from 'react-icons/fa';

const socket = io("http://localhost:8000");

function Chat() {
  const { roomid } = useParams()
  const navigate = useNavigate(); 
  const chatContainerRef = useRef()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [users,setusers]=useState([])
  const [typing,settyping]=useState("")

  useEffect(() =>{
    socket.emit("connecting_room", roomid,getCookie("photo"),getCookie("username"))
  },[])

  useEffect(() => {
    axios.get(`https://s60-mohanavamsi-chayo.onrender.com/data/${roomid}`).then(
      (res)=>{
        console.log(res.data[0].messages)
        setMessages(res.data[0].messages)
      }
    )
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

socket.on("userList",(list)=>{
  console.log(list)
  setusers(list)
})
  socket.on("show", (message, user, photo) => {
    setMessages([...messages, { user: user, message: message, photo: photo }])
  });
  socket.on("typeing",(user)=>{
    console.log(user)
    if (user!="no_one"){
      settyping(`${user} is typing...`)
    }
    else{
      settyping("")
    }
  })
  function sendMessage() {
    if (newMessage.trim() !== "") {
      socket.emit("message", newMessage, roomid, getCookie("username"), getCookie("photo"))
      setNewMessage("")
    }
  }

  function enter(e){
    if (e==="Enter"){
      sendMessage()
    }
  }
  function Message(e){
    const {value}=e
    socket.emit("typing",getCookie("username"),roomid)
    setNewMessage(value)
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
                <h1 className={window.outerWidth>=600?"font-semibold text-wrap text-l break-words line-clamp-2":"font-semibold text-sm text-wrap break-words line-clamp-2"}>
                {message.user}</h1>
              </div>
             
            </div>
            <p>{message.message}</p>
          </div>
          </div>
        ))}
      <h1 className={` text-white text-md relative ${window.outerWidth>=600 ?" bottom-2": "bottom-3"}`}>{typing}</h1>
      </div>
      <div className={window.outerWidth>=600 ? "flex flex-col absolute left-1 items-center mt-4 p-3 over": " hidden"}>
      <h1 className=" text-white text-5xl">Users in room</h1>
                    {users.map((user, index) => (
                        <div
                            key={index}
                            className="flex items-center text-white w-80 border border-white shadow-md shadow-white p-2 mt-4 cursor-pointer transition duration-300 ease-in-out hover:bg-white hover:text-black rounded-xl"
                        >
                            <img
                                src={user.photo}
                                alt={user.name}
                                className="w-16 h-16 rounded-full mr-4"
                            />
                            <div className="flex flex-col">
                                <h1 className="text-3xl ">{user.name}</h1>
                            </div>
                        </div>
                    ))}
                    
                </div>
      <div className="fixed bottom-4 flex justify-center w-full">
        <textarea
          className="w-96 bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
          value={newMessage}
          onChange={(e) => Message(e.target)}
          onKeyDown={(e)=>{enter(e.key)}}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg ml-4">
          Send
        </button>
      </div>
      <button onClick={() => navigate("/")} className="absolute top-4 left-4 rounded-full broder border-white hover:bg-white hover:text-black text-white p-2 flex items-center">
        <FaArrowLeft className=" size-5" />
      </button>
    </div>
  );
}

export default Chat;
