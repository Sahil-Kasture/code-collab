import React,{useContext,createContext,useState,useRef, use, useEffect} from 'react'
import socket from '../scripts/sockets'

const AuthContext=createContext(null)

export function AuthProvider({children}) {
  const [roomName, setRoomName] = useState("Collaborative Session");
  const [messages,setMessages]=useState([])
  const [usersData,setUsersData]=useState({})
  const [canEdit,setCanEdit]=useState(true)
  const [canChat,setCanChat]=useState(true)
  const [isAdmin,setAdmin]=useState(true)
  const [users,setUsers]=useState([])
  const [socketId,setId]=useState(socket.id)
  const [rightPanel,setRightPanel]=useState(true)
  const [user,setUser]=useState(window.localStorage.getItem("username")||'')
  let me=(name)=>{setUser(name);window.localStorage.setItem("username",name)}
  const isInitializing = useRef(false);
  const [isPublic, setIsPublicState] = useState(true);
  const [file, setFile] = useState(
      {
      name: 'script',
      language: 'javascript',
      value: "//code here ",
    }
  );
  useEffect(()=>{
    const user=window.localStorage.getItem("username")
    me=user
  },[])
  const [roomId,setRoom]=useState(null)
    
    const setRoomId=(id)=>setRoom(id)
    const setLang=(lang)=>{setFile((prev)=>({...prev,language:lang}))}
    const updateFile=(code)=>setFile((prev)=>({...prev,value:code}))
  return (
    <AuthContext.Provider value={{users,setUsers,socketId,file,updateFile,setLang,
    roomId,me,setRoomId,user,isInitializing,isAdmin,setAdmin,setId,isPublic
    ,setIsPublicState,usersData,setUsersData,canEdit,canChat,setUser,
    setCanEdit,setCanChat,messages,setMessages,roomName,setRoomName,rightPanel,setRightPanel}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth=()=>useContext(AuthContext)