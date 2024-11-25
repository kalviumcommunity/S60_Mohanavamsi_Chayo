import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router"
import api from "./Api"
function Forget(){
    const [state,setstate]=useState({})
    const [otpd,setotp]=useState(false)
    const [load,setload]=useState(false)
    const nav=useNavigate()
    function change(e) {
        const {name,value}=e
        setstate({...state,[name]:value})
    }
    function otp() {
      console.log(state)
      if(Object.keys(state).length != 0){
      setload(true)
      axios.post(`${api}/otp`,state).then(
          (res)=>{
              sessionStorage.setItem("otp",res.data)
              setotp(true)
              setload(false)
          }
      )}
      else{
        alert("Please provide email")
      }
  }
  function reset() {
    if(Object.keys(state).length==3){
    setload(true)
      axios.put(`${api}/otpvalid`,{...state,otp:sessionStorage.getItem("otp"),userotp:state.otp}).then(
          (res)=>{
              console.log(res.data)
              if(res.data=="Password updated successfully"){
                nav("/")
            }
            else if(res.data == "Invalid OTP"){
                alert("wrong otp")
            }
            else if (res.data=="User not in database"){
                alert("you are not in database")
            }
          }
      )
    }
    else{
        alert("Please fill the data")
    }
  }
    return(
        <div className=" bg-gray-950 h-screen flex flex-col justify-center items-center">
        <div className="w-80 rounded-2xl bg-black border-white border">
     <div className="flex flex-col gap-2 p-8">
     <p className="text-center text-3xl text-gray-300 mb-4">Reset</p>
 <input className="bg-slate-900 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800 text-white" 
       name="email"
       onChange={(e)=>{change(e.target)}}
       placeholder="Email"/>
       {! load && (<p className={ !otpd ?`text-white ml-2` :" hidden"} onClick={otp}>send the otp</p>)}
        <input className={otpd ? `bg-slate-900 text-white w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800` : "hidden"}
       name="otp"
       onChange={(e)=>{change(e.target)}}
       placeholder="OTP"/>
       <input className={ otpd ?`bg-slate-900 text-white w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800` :"hidden"}
       name="password"
       onChange={(e)=>{change(e.target)}}
       placeholder="Password"/>
       {load && (<div className="w-full gap-x-2 flex justify-center items-center">
  <div
    className="w-5 bg-[#d991c2]  h-5 rounded-full animate-bounce"
  ></div>
  <div
    className="w-5  h-5 bg-[#9869b8] rounded-full animate-bounce"
  ></div>
  <div
    className="w-5 h-5  bg-[#6756cc] rounded-full animate-bounce"
  ></div>
</div>)}
     <button 
       onClick={reset}
       className={ otpd ? 
      `cursor-pointer transition-all 
bg-gray-700 text-white px-6 py-2 rounded-lg
   border-white
   border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
   active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:shadow-xl hover:bg-white hover:text-black shadow-white active:shadow-none` :" hidden"}>
     Reset
   </button>
     </div>
        </div></div>
)}
export default Forget;
