import {Route, Routes} from "react-router-dom"
import Home from "./components/Home"
import Chat from "./components/chat"
import Sigin from "./components/sign"
import Login from "./components/Login"
import Forget from "./components/Forget"
import Fire from "./components/firebase"
import Username from "./components/usename"
import Single from "./components/Single"
import Video from "./components/video"
function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/> {/* Home */}
      <Route path="/chat/:roomid" element={<Chat/>}/>{/* Chat */}
      <Route path="/sign" element={<Sigin/>}/>{/* Sign */}
      <Route path="/login" element={<Login/>}/>{/* Login */}
      <Route path="/reset" element={<Forget/>}/>{/* Reset */}
      <Route path="/firebase" element={<Fire/>}/>
      <Route path="/username" element={<Username/>}/>
      <Route path="/single/:roomid" element={<Single/>}/>
      <Route path="/video" element={<Video/>}/>
    </Routes>
    </>
  )
}

export default App
