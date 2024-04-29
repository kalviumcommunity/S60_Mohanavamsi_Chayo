import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router"; 
import { io } from "socket.io-client";
import { getCookie } from "./nav";
import axios from "axios";
import { FaArrowLeft, FaEllipsisV } from 'react-icons/fa';

const socket = io("https://s60-mohanavamsi-chayo.onrender.com");

function Chat() {
  const { roomid } = useParams()
  const navigate = useNavigate(); 
  const chatContainerRef = useRef()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [showDropdown, setShowDropdown] = useState(null);

  useEffect(() => {
    socket.emit("connecting_room", roomid)
  }, [])

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

  socket.on("show", (message, user, photo) => {
    setMessages([...messages, { user: user, message: message, photo: photo }])
  });

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

  function scrollToBottom(){
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }

  function deleteMessage(messageId) {
    axios.delete(`https://s60-mohanavamsi-chayo.onrender.com/delete/${messageId}/${roomid}`)
      .then(() => {
        const updatedMessages = messages.filter((message)=> { return message._id !== messageId});
        setMessages(updatedMessages);
        setShowDropdown(null)

      })
      .catch(error => {
        console.error('Error deleting message:', error);
      });
  }
  function updateMessage(messageId) {
    const updatedMessageContent=prompt("enter to update message")
    axios.put(`https://s60-mohanavamsi-chayo.onrender.com/update/${messageId}/${roomid}`, { message: updatedMessageContent })
      .then(() => {
        const updatedMessages = messages.map((message) => {
          if (message._id === messageId) {
            return { ...message, message: updatedMessageContent };
          }
          return message;
        });
        setShowDropdown(null)
        setMessages(updatedMessages);
      })
      .catch(error => {
        console.error('Error updating message:', error);
      });
  }
  
  function toggleDropdown(messageId) {
    setShowDropdown(showDropdown === messageId ? null : messageId);
  }
  const isCurrentUser = (username) => {
    return username === getCookie("username");
  };

  return (
    <div className="h-screen bg-gray-950 p-2 flex flex-col justify-center items-center">
      <div className="overflow-y-scroll h-5/6 w-6/12 relative bottom-4 bg-black rounded-2xl pt-2 pl-2" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div key={index} className={`border border-gray-800 m-2 bg-gray-800 ${isCurrentUser(message.user) ? 'ml-2' : 'ml-96'} text-white w-56 relative p-3 rounded-xl shadow-xl`} onDoubleClick={() => { deleteMessage(message._id) }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={message.photo} alt="User" className="h-8 w-8 rounded-full mr-2" />
                <h1 className="font-semibold">{message.user}</h1>
              </div>
              <div className={isCurrentUser(message.user) ?'relative' : "hidden"}>
                <FaEllipsisV onClick={() => toggleDropdown(message._id)} className="cursor-pointer" />
                {showDropdown === message._id && (
                  <div className="absolute left-2 border shadow-inner shadow-black border-white mt-2 w-48  bg-slate-900 rounded-lg  z-10">
                    <ul className="list-none p-3">
                      <li className="text-white hover:bg-red-700 px-4 py-2  rounded-md cursor-pointer" onClick={() => deleteMessage(message._id)}>Delete</li>
                      <hr className=" m-1"/>
                      <li className="text-white hover:bg-blue-400 px-4 py-2 rounded-md cursor-pointer" onClick={() => updateMessage(message._id)}>Update</li>
                    </ul>
                  </div>
                )}
              </div>
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
      <button onClick={() => navigate("/")} className="absolute top-4 left-4 rounded-full broder border-white hover:bg-white hover:text-black text-white p-2 flex items-center">
        <FaArrowLeft className=" size-5" />
      </button>
    </div>
  );
}

export default Chat;
