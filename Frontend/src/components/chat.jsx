import axios from "axios";
import { useState } from "react";
import {   useParams } from "react-router";
import { io } from "socket.io-client";

const socket = io("https://chat-test-cpoo.onrender.com");
// function getCookie(name) {
//   let cookieArray = document.cookie.split('; ')
//   let cookie = cookieArray.find((row) => row.startsWith(name + '='))
//   return cookie ? cookie.split('=')[1] :""
// }
function Chat() {
  const {roomid}=useParams()
  console.log(roomid)
  const [messages, setmessages] = useState([{ user: "mohana", message: "hihd" }]);
  const [newMessage, setNewMessage] = useState("");
  function message() {
    console.log(newMessage) 
  }
  return (
    <>
    <div className="h-screen bg-gray-950 p-2 flex flex-col justify-center items-center">
  <div className="overflow-y-scroll h-5/6 w-96 relative bottom-4 bg-black rounded-2xl pt-2 ">
    {messages.map((i, j) => (
      <div
        key={j}
        className="border border-gray-800 m-2 bg-gray-800 ml-32 text-white w-56 relative p-3 rounded-xl shadow-xl"
      >
        <h1 className="font-semibold">{i.user}</h1>
        <p>{i.message}</p>
        </div>
    ))}
  </div>
  <div className="fixed bottom-4 flex justify-center w-full">
    <textarea
      className="w-96 bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      placeholder="Type your message..."
    />
    <button onClick={message} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg ml-4">
      Send
    </button>
  </div>
</div>

 </>
  );
}

export default Chat;