import { useEffect, useRef, useState } from "react"
import { getCookie } from "./nav";
import { io } from "socket.io-client";
function Video(){
    const [stream, setStream ] = useState()
    const [audio,setaudio]=useState(false)
    const [video,setvideo]=useState(false)
    const localvideo=useRef()
    const remotevideo=useRef()
    const socket = io("http://localhost:8000");
    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((strem) => {
			localvideo.current.srcObject = strem
            console.log(strem.getTracks())
            socket.emit("remote",strem)
            setStream(strem)
		})
        socket.on("remotevideo",(st)=>{
            remotevideo.current.srcObjec =st
        })
    },[])
    function audioset(){
        if (audio){
            navigator.mediaDevices.getUserMedia({video:true,audio:false}).then((strem)=>{
                localvideo.current.srcObject = strem
        })
        setaudio(false)
        }
        else{
            navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((strem)=>{
			localvideo.current.srcObject = strem
            })
            setaudio(true)
        }
    }
    function videoset(){
        if (video){
            navigator.mediaDevices.getUserMedia({video:false,audio:true}).then((strem)=>{
            localvideo.current.srcObject = strem
        })
        setvideo(false)
        }
        else{
            navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((strem)=>{
			localvideo.current.srcObject = strem
            })
            setvideo(true)
        }
    }

    return(
        <div className="h-screen bg-gray-950 p-2 flex flex-col justify-center items-center">
        <div className=" flex">
            <div className="w-6/12 relative">
            <video playsInline autoPlay ref={localvideo} className=" rounded-lg w-full"/>
            <h1 className=" text-white absolute bottom-1 left-2 font-semibold">{getCookie("username")}</h1>
            </div>
        </div>
            <button className=" text-white" onClick={audioset}>Audio</button>
            <button className=" text-white" onClick={videoset}>Video</button>
        </div>
    )
}
export default Video