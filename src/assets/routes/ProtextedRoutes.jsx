import React ,{useState,useEffect} from 'react'
import { useAuth } from '../context/JoinContext'
import {  Navigate } from 'react-router-dom'
import API from '../api/Api'
import LoaderOverlay from '../componets/Loader'

function ProtextedRoutes({ children }) {
  const { user , setUser} = useAuth();
  const [isVerified, setIsVerified] = useState(null); 
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = window.localStorage.getItem("token");
        const res = await API.post("/verify", { token });
        setIsVerified(res.data.success);
        setUser(window.localStorage.getItem("username"))
      } catch (err) {
        setIsVerified(false);
      }
    };

    verifyToken();
  }, []);

  if (isVerified === null) {
    return <div><LoaderOverlay show={true}/></div>;
  }

  return isVerified && user ? <>{children}</> : <Navigate to="/" />;
}
export default ProtextedRoutes;

function ProtectRooms({children}) {
    const {roomId}=useAuth()
  return (
    <>
      {roomId ? <>{children}</> : <Navigate to="/dashboard" />}
    </>
  )
}
export {ProtectRooms};