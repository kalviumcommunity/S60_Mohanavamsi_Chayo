import axios from "axios";
import { useState } from "react";
import { useLocation,useNavigate } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Username(){
    const data=useLocation().state
    const [user,setuser]=useState("")
    const [value,setvalue]=useState("")
    const [load,setload]=useState(false)
    const nav=useNavigate()
    function va(e) {
        console.log(e)
        setuser(e)
    }
    
    function login(){
        if (value && user){
            setload(true)
        axios.post("https://s60-mohanavamsi-chayo-2ovy.onrender.com/firebase",{...data,username:user,photo:value}).then(
            (res)=>{
              console.log(res.data)
                if(res.data=="Username taken"){
                  toast(res.data,{closeOnClick:true,theme:"dark"})
                    setload(false)
                }
                else if (res.data.message=="User created"){
                document.cookie=⁠ username=${res.data.username} ⁠
                document.cookie=⁠ token=${res.data.token} ⁠
                nav("/")
                }
            }
        )
    }
    else{
        alert("wait a min we need to upload a pic")
    }
}
  
    const photo = async (e) => {
        const reader=new FileReader()
        setload(true)
        reader.onload =async  function(e) {
            try {
                const response = await axios.post('https://api.cloudinary.com/v1_1/dus9hgplo/image/upload', {file:e.target.result,upload_preset:"vh0llv8b"});
                console.log('File uploaded successfully:', response.data);
                setload(false)
                document.cookie=⁠ photo=${response.data.secure_url} ⁠
                setvalue(response.data.secure_url)
              } catch (error) {
                console.error('Error uploading photo:', error);
              }
        }
        reader.readAsDataURL(e.target.files[0]);
        
      };
    return(
        <div className=" h-screen bg-gray-950 flex flex-col items-center justify-center">
        <input className="bg-slate-900 text-white w-56
         rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800" 
       name="email"
       onChange={(e)=>{va(e.target.value)}}
       placeholder="Name"/>
        <input
        className="bg-slate-900 text-white w-56 mt-2 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800"
        name="file"
        type="file"
        onChange={(e) => {photo(e);}}
            placeholder="files"
                    />
       <button className=" w-48 mt-3 h-12 border hover:bg-white hover:text-black border-white text-white" onClick={login}>Submit</button>
       {load && (<div className="w-full gap-x-2 mt-4 flex justify-center items-center">
  <div
    className="w-5 bg-[#d991c2]  h-5 rounded-full animate-bounce"
  ></div>
  <div
    className="w-5  h-5 bg-[#9869b8] rounded-full animate-bounce"
  ></div>
  <div
    className="w-5 h-5  bg-[#6756cc] rounded-full animate-bounce"
  ></div>
</div>
)}
<ToastContainer/>
        </div>
        
    )
    }
export default Username;
