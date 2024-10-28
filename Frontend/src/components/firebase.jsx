import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import axios from "axios";
import { useNavigate } from "react-router";

const firebaseConfig = {
  apiKey: "AIzaSyCKQZ1eeauSlM79nNPSdvRm2WbYOx1kpiE",
  authDomain: "chayo-e1d53.firebaseapp.com",
  projectId: "chayo-e1d53",
  storageBucket: "chayo-e1d53.appspot.com",
  messagingSenderId: "400822371282",
  appId: "1:400822371282:web:26dcd35b5854d8e8b9be0b"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

function Fire() {
    const nav=useNavigate()
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        axios.post("https://s60-mohanavamsi-chayo-ra7t.onrender.com/check",{email:user.email}).then(
            (res)=>{
              console.log(res)
              if(res.data.message=="login"){
                console.log(res.data)
                document.cookie=`username=${res.data.username}`
                document.cookie=`token=${res.data.token}`
                document.cookie=`photo=${res.data.photo}`
                nav("/")
              }
              else if (res.data.message=="sign"){
                nav("/username",{state:{email:user.email,password:user.uid,photo:user.photoURL}})
              }
                
            }
        )
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  return (
    <button onClick={signInWithGoogle} className="bg-black mb-2  border-white border-2 text-white hover:bg-white  hover:text-black font-bold py-2 px-4 rounded flex items-center">
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="mr-2 w-6 h-6" />
      Sign in with Google
    </button>
  );
}

export default Fire;
