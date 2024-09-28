import { useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useNavigate } from "react-router-dom";
import Fire from "./firebase";

function Sigin() {
    const [data, setvalue] = useState({ username: '', email: '', password: '', photo: '' });
    const [error, seterror] = useState({});
    const [load, setload] = useState(false);
    const [valid, setvalid] = useState(false);
    const nav = useNavigate();

    function va(e) {
        const { name, value } = e.target;
        const ne = { ...data };
        ne[name] = value;
        setvalue(ne);
    }
    function submit() {
        console.log(data);
        if (Object.keys(data).length==4 && valid) {
        setload(true);
            axios.post("https://s60-mohanavamsi-chayo-2ovy.onrender.com/sign", data)
                .then((res) => {
                    const response = res;
                    console.log(response);
                    if (response.data.message=="User Created!!"){
                        document.cookie = `username=${response.data.username}`;
                        document.cookie = `token=${response.data.token}`;
                        document.cookie=`photo=${response.data.photo}`
                        nav("/");
                    }
                
                })
                .catch((e) => {
                    console.log(e);
                    setload(false)
                });
        } else {
            alert("hey please check all again! and submit");
            setload(false)
        }
    }

    function handleCaptcha() {
        setvalid(true);
    }
    const photo = async (e) => {
        setload(true)
        const reader=new FileReader()
        reader.onload =async  function(e) {
            try {
                const response = await axios.post('https://api.cloudinary.com/v1_1/dus9hgplo/image/upload', {file:e.target.result,upload_preset:"vh0llv8b"});
                console.log('File uploaded successfully:', response.data);
                document.cookie=`photo=${response.data.secure_url}`
                setvalue({...data,photo:response.data.secure_url})
                setload(false)
              } catch (error) {
                console.error('Error uploading photo:', error);
              }
        }
        reader.readAsDataURL(e.target.files[0]);
        
      };
      return (   
        <div className="h-screen bg-gray-950 flex justify-center flex-wrap items-center flex-col">
            {error.login && (
                <div className="w-70 bg-red-400 text-white rounded-xl p-4">{error.login}</div>
            )}
            <div onClick={()=>{setload(true)}}><Fire/></div>
            <div className="w-80 rounded-2xl bg-black border-white">
                <div className="flex flex-col gap-2 p-8">
                    <p className="text-center text-3xl text-gray-300 mb-4">Sign</p>
                    
                    <input
                        className="bg-slate-900 text-white w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800"
                        name="username"
                        onChange={(e) => {
                            va(e);
                        }}
                        placeholder="Name"
                    />
                    <span>{error.name || ""}</span>
                    <input
                        className="bg-slate-900 text-white w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800"
                        name="email"
                        onChange={(e) => {
                            va(e);
                        }}
                        placeholder="Email"
                    />
                    <span className=" text-red-500">{error.email || ""}</span>
                    <input
                        className="bg-slate-900 text-white w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800"
                        name="password"
                        type="password"
                        onChange={(e) => {
                            va(e);
                        }}
                        placeholder="Password"
                    />
                    <input
                        className="bg-slate-900 text-white w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800"
                        name="file"
                        type="file"
                        onChange={(e) => {
                            photo(e);
                        }}
                        placeholder="files"
                    />
                    <span className=" text-red-500">{error.password || ""}</span>
                    <ReCAPTCHA
                        sitekey="6LeuILspAAAAAGgpzzoN3jbDbJX5VB-8h6UK5JVn"
                        onChange={handleCaptcha}
                        className=" relative right-5"
                        
                    />
                    <button
                        className={`cursor-pointer transition-all 
                            bg-gray-700 text-white px-6 py-2 rounded-lg
                            border-white
                            border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                            active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:shadow-xl hover:shadow-white  active:shadow-none`}
                        onClick={submit}
                        disabled={!valid}
                    >
                        Sign
                    </button>
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
</div>
)}
                    <Link className="text-purple-600 text-center" to={"/login"}>
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Sigin;
