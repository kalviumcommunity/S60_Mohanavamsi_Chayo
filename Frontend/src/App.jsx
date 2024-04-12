import {Route, Routes} from "react-router-dom"
import Home from "./components/Home"
import Chat from "./components/chat"
import Sigin from "./components/sign"
import Login from "./components/Login"
import Forget from "./components/Forget"
function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/> {/* Home */}
      <Route path="/chat/:roomid" element={<Chat/>}/>{/* Chat */}
      <Route path="/sign" element={<Sigin/>}/>{/* Sign */}
      <Route path="/login" element={<Login/>}/>{/* Login */}
      <Route path="/reset" element={<Forget/>}/>{/* Reset */}
    </Routes>
    </>
  )
}

export default App
