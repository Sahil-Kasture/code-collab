import React ,{useState,useEffect} from "react";
import { Link , useNavigate} from "react-router-dom";
import API from "../api/Api.js";
import LoaderOverlay from '../componets/Loader.jsx'
import ErrorPage from '../componets/Error.jsx'
import socket from "../scripts/sockets.js";
import {GoogleLogin} from '@react-oauth/google'

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  
  async function handleLogin() {
    if (usernameOrEmail === "" || password === "") {
      setError(true);
      setErrorMessage("All fields are required");
      return;
    }
    try {
      setLoading(true);
      const response = await API.post("/login", {
        email: usernameOrEmail,
        password,
      });
      window.localStorage.setItem("token", response.data.token);
      window.localStorage.setItem("username", response.data.user.username);
      socket.auth = { token: response.data.token };
      socket.connect();
      
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.response?.data?.msg || "Failed to login");
      setError(true);
      return;
    }
  }

  function visible(){
    setPasswordVisible(!passwordVisible)
  }
  
  const successGoogle = async (response) => {
    setLoading(true)
    try{
      const apiResponse = await API.post('/google-login',{
        token: response.credential
      })
      window.localStorage.setItem("token", apiResponse.data.token)
      window.localStorage.setItem("username", apiResponse.data.user)
      socket.auth = { token: apiResponse.data.token };
      socket.connect();
      setLoading(false)
      navigate("/dashboard");
    }catch(err){
      setLoading(false)
      setError(true)
      setErrorMessage(err.response?.data?.msg || "Failed to login with Google")
      return
    }
  }

  const failureGoogle = (error) => {
    setLoading(false)
    setError(true)
    setErrorMessage(error.error)
    return
  }
  

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-x-hidden transition-colors"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col items-center justify-center">
        <div className="px-4 flex w-full max-w-md flex-col justify-center py-5">
          <div className="layout-content-container flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-3 text-center">
              <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Code Collab
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-base font-normal leading-normal">
                Log in to your account
              </p>
            </div>

            {/* Login Form */}
            <div className="flex flex-col gap-4">
              <label className="flex flex-col">
                <p className="text-gray-900 dark:text-white text-base font-medium pb-2">
                  Username or Email
                </p>
                <input
                 value={usernameOrEmail}
                  className="form-input flex w-full rounded-lg text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 h-14 placeholder:text-gray-500 dark:placeholder:text-gray-400 p-[15px] text-base transition-colors"
                  placeholder="Enter your username or email"
                  type="text"
                  onChange={(e)=>setUsernameOrEmail(e.target.value)}
                />
              </label>

              <label className="flex flex-col">
                <p className="text-gray-900 dark:text-white text-base font-medium pb-2">
                  Password
                </p>
                <div className="flex w-full items-stretch">
                  <input
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    className="form-input flex w-full rounded-l-lg text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 h-14 placeholder:text-gray-500 dark:placeholder:text-gray-400 p-[15px] pr-2 text-base transition-colors"
                    placeholder="Enter your password"
                    type={passwordVisible ? "text" : "password"}
                  />
                  <div onClick={visible} className="text-gray-500 dark:text-gray-400 pl-3 flex border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 items-center justify-center pr-[15px] rounded-r-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <span className="material-symbols-outlined">
                      {passwordVisible ? "visibility_off" : "visibility"}
                    </span>
                  </div>
                </div>
              </label>

              <p className="text-gray-600 dark:text-gray-300 text-sm underline cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Forgot Password?
              </p>
            </div>

            {/* Login Button */}
            <button onClick={handleLogin} className="flex items-center justify-center rounded-lg h-12 px-5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 hover:cursor-pointer text-white text-base font-bold focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-colors">
              <span>Login</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">OR</p>
              <div className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></div>
            </div>

            {/* Social Logins */}
            <div className="flex flex-col gap-4 h-full">
              <GoogleLogin
                onSuccess={successGoogle}
                onFailure={failureGoogle}
                cookiePolicy={'single_host_origin'}
                useOneTap={false}
                auto_select={false}
                ux_mode="popup"
              />
            </div>

            {/* Signup Link */}
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Don't have an account?{" "}
                <Link to="/signUp" className="text-blue-600 dark:text-blue-400 font-medium underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      { <LoaderOverlay show={loading} />}
      <ErrorPage show={error} onClose={() => { setError(false); }} errorMessage={errorMessage} />
    </div>
  );
};

export default LoginPage;
