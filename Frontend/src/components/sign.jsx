import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
function Sigin() {

    return(
        <div className="h-screen bg-gray-950 flex justify-center items-center flex-col">

        <div className="w-80 rounded-2xl bg-black border border-white">
     <div className="flex flex-col gap-2 p-8">
     <p className="text-center text-3xl text-gray-300 mb-4">Sign</p>
       <input className="bg-slate-900 text-white w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800" 
       name="name"
       onChange={(e)=>{va(e)}}
       placeholder="Name"/>
       <input className="bg-slate-900 text-white w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800" 
       name="email"
       onChange={(e)=>{va(e)}}
       placeholder="Email"/>
       <input className="bg-slate-900 text-white w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800" 
       name="password"
       type="password"
       onChange={(e)=>{va(e)}}
       placeholder="Password"/>
       <button className="cursor-pointer transition-all 
   bg-gray-700 text-white px-6 py-2 rounded-lg
   border-white
   border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
   active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:shadow-xl hover:bg-white hover:text-black shadow-white active:shadow-none">
     Sign
   </button>
   <Link className=" text-purple-600 text-center" to={"/login"}>Login</Link>

     </div>
   </div>
       {/* <button onClick={submit}>Submit</button> */}
   </div>
    )
}
export default Sigin;