import React ,{useState,useEffect} from "react";
import { Link, Navigate } from "react-router-dom";
import socket from '../scripts/sockets.js'
import { useAuth } from '../context/JoinContext.jsx'
import API from '../api/Api.js'
import LoaderOverlay from '../componets/Loader.jsx'
import ErrorPage from '../componets/Error.jsx'
import {GoogleLogin} from '@react-oauth/google'

export default function SignUpPage() {
  const [username,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [confirmPassword,setConfirmPassword]=useState('')
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading,setLoading]=useState(false)
  
  async function createAccount(){
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(username==="" || email==="" || password==="" || confirmPassword===""){
        setError(true)
        setErrorMessage('All fields are required')
        return
    }
    if(!re.test(email)){
        setError(true)
        setErrorMessage('Please enter a valid email address')
        return
    }
    if(password!==confirmPassword){
        setError(true)
        setErrorMessage('Passwords do not match')
        return
    }
    try{
        
        setLoading(true)
        const response = await API.post('/register',{
            username,
            email,
            password
        })
        setLoading(false)
        window.location.href="/login"
    }catch(err){
      setLoading(false)
      setError(true)
      setErrorMessage(err.response?.data?.msg || "Failed to create account")
      return
    }
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
      window.location.href = "/dashboard";
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
    <div className="bg-gray-50 dark:bg-gray-900 font-display min-h-screen flex flex-col items-center justify-center p-4 overflow-x-hidden transition-colors">
      <div className="flex flex-col items-center w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Code Collab</h1>
        </div>

        <div className="w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
                Create Your Account
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <label className="flex flex-col">
                <p className="text-base font-medium pb-2 text-gray-900 dark:text-white">
                  Full Name
                </p>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={username}
                  onChange={(e)=>{
                    setName(e.target.value)
                  }}
                  
                  className="form-input w-full rounded-lg text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 h-14 p-4 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors"
                />
              </label>

              <label className="flex flex-col">
                <p className="text-base font-medium pb-2 text-gray-900 dark:text-white">
                  Email
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                    value={email}
                    onChange={(e)=>{
                        setEmail(e.target.value)
                    }}
                  className="form-input w-full rounded-lg text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 h-14 p-4 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors"
                />
              </label>

              <label className="flex flex-col">
                <p className="text-base font-medium pb-2 text-gray-900 dark:text-white">
                  Password
                </p>
                <input
                  type="password"
                  placeholder="Enter your password"
                    value={password}
                    onChange={(e)=>{
                        setPassword(e.target.value)
                    }}
                  className="form-input w-full rounded-lg text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 h-14 p-4 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors"
                />
              </label>

              <label className="flex flex-col">
                <p className="text-base font-medium pb-2 text-gray-900 dark:text-white">
                  Confirm Password
                </p>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e)=>{
                    setConfirmPassword(e.target.value)
                  }}
                  className="form-input w-full rounded-lg text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 h-14 p-4 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors"
                />
              </label>
            </div>
            
            <button onClick={createAccount} className="w-full h-14 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 hover:cursor-pointer text-white font-bold rounded-lg focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-colors">
              Create Account
            </button>

            <div className="flex items-center gap-4">
              <hr className="w-full border-t border-gray-300 dark:border-gray-600" />
              <span className="text-sm text-gray-500 dark:text-gray-400">OR</span>
              <hr className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>

            <div className="flex flex-col gap-4">
                <GoogleLogin
                  onSuccess={successGoogle}
                  onFailure={failureGoogle}
                  cookiePolicy={'single_host_origin'}
                  useOneTap={false}
                  auto_select={false}
                  ux_mode="popup"
                />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              Log In
            </Link>
          </p>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 Sahil Kasture . All rights reserved.</p>
        </footer>   
      </div>
    <ErrorPage show={error} onClose={()=>{setError(false)}} errorMessage={errorMessage}/>
    <LoaderOverlay show={loading}/>
    </div>
  );
}
