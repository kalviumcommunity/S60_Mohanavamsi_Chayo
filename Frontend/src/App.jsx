import { useState } from "react"
import {Route, Routes} from "react-router-dom"
import {io} from "socket.io-client"
import axios from "axios"
function App() {
  const [name,setname]=useState("name will change click the test button")
  let socket=io("https://s60-mohanavamsi-chayo.onrender.com")
  const [email,setmail]=useState("")
  function test() {
    console.log("hi")
    socket.emit("test","chayo is working!!")
    socket.on("rev",(name)=>{
      setname(name)
    })
  }
  function mailtest(){
    console.log(email)
  axios.post("https://s60-mohanavamsi-chayo.onrender.com/testmail",{mail:email}).then(
    (res)=>{console.log(res)}
  )
  }
  function change(e){
    setmail(e.value)
  }
  return (
    <>
    <Routes>
      <Route to="/home"/> {/* Home */}
      <Route to="/chat/:roomid"/>{/* Chat */}
      <Route to="/sign"/>{/* Sign */}
      <Route to="/login"/>{/* Login */}
      <Route to="/reset"/>{/* Reset */}
    </Routes>
    <h1>Chayo</h1>
      <h1>{name}</h1>
      <input placeholder="email" onChange={(e)=>change(e.target)}/>
      <button onClick={test}>Test</button>
      <button onClick={mailtest}>Mail</button>
    </>
  )
}

export default App
