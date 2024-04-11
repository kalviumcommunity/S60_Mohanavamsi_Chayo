function Forget(){
    return(
        <div className=" bg-gray-950 h-screen flex flex-col justify-center items-center">
        <div className="w-80 rounded-2xl bg-black border-white border">
     <div className="flex flex-col gap-2 p-8">
     <p className="text-center text-3xl text-gray-300 mb-4">Reset</p>
 <input className="bg-slate-900 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800 text-white" 
       name="email"
       placeholder="Email"/>
       <p className=" text-white ml-2">send the otp</p>
        <input className="bg-slate-900 text-white w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800" 
       name="otp"
       placeholder="OTP"/>
       <input className="bg-slate-900 text-white w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800" 
       name="password"
       placeholder="Password"/>
       <button className="cursor-pointer transition-all 
   bg-gray-700 text-white px-6 py-2 rounded-lg
   border-white
   border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
   active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:shadow-xl hover:bg-white hover:text-black shadow-white active:shadow-none">
     Reset
   </button>
     </div>
        </div></div>
)}
export default Forget;