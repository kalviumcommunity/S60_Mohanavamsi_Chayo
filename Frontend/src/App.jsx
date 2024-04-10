import { useState } from "react"
import axios from "axios"
import {Form, Route, Routes} from "react-router-dom"
import {io} from "socket.io-client"
function App() {
  const socket=io("http://localhost:8000")
  const [email,setmail]=useState("")
  const [name,setname]=useState("name will change click the test button")
  function test() {
    console.log("hi")
    socket.emit("test","chayo is working!!")
    socket.on("rev",(name)=>{
      setname(name)
    })
  }
  function mailtest(){
    console.log(email)
  axios.post("http://localhost:8000/testmail",{mail:email}).then(
    (res)=>{console.log(res)}
  )
  }
  function change(e){
    setmail(e.value)
  }
  return (
    <>
      <h1>Chayo</h1>
      <h1>{name}</h1>
      <input placeholder="email" onChange={(e)=>change(e.target)}/>
      <button onClick={test}>Test</button>
      <button onClick={mailtest}>Mail</button>
    </>
  )
}

export default App
