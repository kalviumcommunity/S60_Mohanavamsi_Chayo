import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import Fire from "./firebase"
import { toast, ToastContainer } from "react-toastify";
function Login() {
  const [data, setvalue] = useState({email: '', password: ''});
  const [error,seterror]=useState({})
    const[load,setload]=useState(false)
    const nav=useNavigate()
    function va(e) {
        const {name,value}=e.target
        const ne={...data}
        ne[name]=value
        seterror({})
        setvalue(ne)
    }
    function submit() {
        console.log(data)
        console.log((Object.keys(data)))
        if (Object.keys(data).length==2){
        axios.post("https://s60-mohanavamsi-chayo-2ovy.onrender.com/login",data).then(
            (res)=>{
              setload(true)
                const response=res
                console.log(response)
                if (response.data.message=="ok"){
                  document.cookie=`username=${response.data.username}`
                        document.cookie=`token=${response.data.token}`
                        document.cookie=`photo=${response.data.photo}`
                        nav("/")
                }
                 
            }
        ).catch((e)=>{
          setload(false)
          toast(e.response.data.message,{theme:"dark"})
          console.log(e)})
        }
        else{
            alert("hey please check all again! and submit")
        }
    }
    return(
        <div className="h-screen bg-gray-950 flex justify-center items-center flex-col">
     {error.login && (<div className=" w-70 bg-red-400 text-white rounded-xl p-4">{error.login}</div>)}
     
        <div className="w-80 rounded-2xl bg-black border border-white">
     <div className="flex flex-col gap-2 p-8">
     <p className="text-center text-3xl text-gray-300 mb-4">Login</p>
       <input className="bg-slate-900 text-white w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800" 
       name="email"
       onChange={(e)=>{va(e)}}
       placeholder="Email"/>
       <span className=" text-red-500">{error.email || ""}</span>
       <input className="bg-slate-900 text-white w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800" 
       name="password"
       type="password"
       onChange={(e)=>{va(e)}}
       placeholder="Password"/>
       <span className=" text-red-500">{error.password || ""}</span>
       <Link className=" text-purple-600" to={"/reset"}>Forget Password!</Link>
       <button className="cursor-pointer transition-all 
   bg-gray-700 text-white px-6 py-2 rounded-lg
   border-white
   border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
   active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:shadow-xl hover:shadow-green-300 shadow-green-300 active:shadow-none"
   onClick={submit}>
    login
   </button>
   <br />
   <center>
   <div onClick={()=>{setload(true)}}><Fire/></div>
   </center>
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
   <Link className=" text-purple-600 text-center" to={"/sign"}>not having an account ? sigin!</Link>
     </div>
   </div>
   <ToastContainer/>
   </div>
    )
}
export default Login;