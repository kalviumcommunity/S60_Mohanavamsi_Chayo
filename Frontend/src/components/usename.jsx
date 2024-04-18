import axios from "axios";
import { useState } from "react";
import { useLocation,useNavigate } from "react-router";

function Username(){
    const data=useLocation().state
    const [user,setuser]=useState("")
    const [value,setvalue]=useState("")
    const nav=useNavigate()
    function va(e) {
        console.log(e)
        setuser(e)
    }
    function login(){
        if (value){
        axios.post("https://s60-mohanavamsi-chayo.onrender.com/firebase",{...data,username:user,photo:value}).then(
            (res)=>{
                if(res.data=="username taken"){
                    alert("username taken !!")
                }
                else{
                document.cookie=`username=${res.data.username}`
                document.cookie=`token=${res.data.token}`
                nav("/")
                }
            }
        )
    }
    else{
        alert("wait a min you  need to upload a pic")
    }
}
  
    const photo = async (e) => {
        const reader=new FileReader()
        reader.onload =async  function(e) {
            try {
                const response = await axios.post('https://api.cloudinary.com/v1_1/dus9hgplo/image/upload', {file:e.target.result,upload_preset:"vh0llv8b"});
                console.log('File uploaded successfully:', response.data);
                document.cookie=`photo=${response.data.secure_url}`
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
        </div>
    )
    }
export default Username;