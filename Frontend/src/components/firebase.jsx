import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

function Fire() {
    const nav=useNavigate()
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        axios.post("https://s60-mohanavamsi-chayo.onrender.com/check",{email:user.email}).then(
            (res)=>{
              console.log(res)
              if(res.data.message=="login"){
                document.cookie=`username=${res.data.username}`
                document.cookie=`token=${res.data.token}`
                nav("/")
              }
              else{
                nav("/username",{state:{email:user.email,password:user.uid,photo:user.photoURL}})
              }
                
            }
        )
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error(errorCode, errorMessage, email, credential);
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
