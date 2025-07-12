
import LogInForm from "@/components/Auth/LogInForm";
import SignInForm from "@/components/Auth/SignInForm";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function AuthenticationPage() {
  const navigate = useNavigate()
    const [isSignin,setisSignin] = useState<boolean>(false)
    axios.defaults.withCredentials = true
   useEffect(() => {

    if(!localStorage.getItem('email')){
      return
    }
  const checkUser = async () => {
    try {
      const res = await axios.post("http://localhost:3000/user/addnewUser/checkunverified");
      if (res.data.success) {
        console.log("Redirecting to verification...");
        navigate(`/verify/${encodeURIComponent(res.data.email)}`);
      }
    } catch (err: any) {
  if (err.response?.status === 400 && err.response?.data?.message === "User not found") {
    // Expected scenario — don’t log as error
    
  } else if (err.response?.status === 401) {
    // User not authenticated
  } else {
    console.error("Unexpected error:", err);
  }
}

  };

  checkUser();
}, []);



  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-neutral-100 px-4 py-8 lg:gap-8 lg:flex-row lg:justify-evenly">
      {/* Header / Title */}
      <div className="text-center max-w-xl mb-8  lg:flex-1 w-full lg:text-left">
        <h2 className="text-3xl md:text-4xl font-bold font-primary text-gray-800 ">
          Leave Management System
        </h2>
        <p className="text-gray-700 mt-2 text-lg md:text-xl font-secondary">
          Efficiently track, request, and manage employee leave.
        </p>
        <p className=" hidden lg:block text-gray-600 mt-2 text-sm md:text-base lg:text-lg">
          Designed to simplify HR processes, the system enables seamless request
          submission, streamlined approval workflows, and real-time email
          notifications to keep employees informed about the status of their
          leave applications.
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 md:p-8">
       {isSignin === true ?  <SignInForm/> :  <LogInForm/>}
        <p className="text-sm mt-2 text-center">{isSignin ? 'Dont Have an Accont ?' : 'Already Have an Account ?'}
             <span className="underline cursor-pointer transition-all duration-300 hover:text-blue-500" onClick={()=>setisSignin(!isSignin)}> Click here!</span></p>
      </div>
       
    </div>
  );
}

export default AuthenticationPage;
