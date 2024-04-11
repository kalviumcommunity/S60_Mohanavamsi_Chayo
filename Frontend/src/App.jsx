import { useState } from "react"
import {Route, Routes} from "react-router-dom"
import {io} from "socket.io-client"
import axios from "axios"
import Home from "./components/Home"
import Chat from "./components/chat"
import Sigin from "./components/sign"
import Login from "./components/Login"
import Forget from "./components/Forget"
function App() {
  // const [name,setname]=useState("name will change click the test button")
  // let socket=io("https://s60-mohanavamsi-chayo.onrender.com")
  // const [email,setmail]=useState("")
  // function test() {
  //   console.log("hi")
  //   socket.emit("test","I am Working")
  //   socket.on("rev",(name)=>{
  //     setname(name)
  //   })
  // }
  // function mailtest(){
  //   console.log(email)
  // axios.post("https://s60-mohanavamsi-chayo.onrender.com/testmail",{mail:email}).then(
  //   (res)=>{console.log(res)}
  // )
  // }
  // function change(e){
  //   setmail(e.value)
  // }
  return (
    <>
    <Routes>
      <Route path="/home" element={<Home/>}/> {/* Home */}
      <Route path="/chat/:roomid" element={<Chat/>}/>{/* Chat */}
      <Route path="/sign" element={<Sigin/>}/>{/* Sign */}
      <Route path="/login" element={<Login/>}/>{/* Login */}
      <Route path="/reset" element={<Forget/>}/>{/* Reset */}
    </Routes>
    {/* <h1>Chayo</h1>
      <h1>{name}</h1>
      <input placeholder="email" onChange={(e)=>change(e.target)}/>
      <button onClick={test}>Test</button>
      <button onClick={mailtest}>Mail</button> */}
    </>
  )
}

export default App
