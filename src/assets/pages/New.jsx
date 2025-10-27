import React, { useState ,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/JoinContext'
import socket, { checkRoom } from '../scripts/sockets'
import ErrorPage from '../componets/Error'
import LoaderOverlay from '../componets/Loader'

function New() {
    const [roomID, setRoomID] = useState('')
    const [name, setName] = useState('')
    const navigate=useNavigate()
    const {user,me,roomId,setRoomId}=useAuth()
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading,setLoading]=useState(false)
    function onRoom(e) {
        const value = e.target.value
        setRoomID(value)
    }
    function onName(e) {
        if(name.length>10){
            setName(name.slice(0,10))
            return
        }
        const value = e.target.value
        setName(value)
    }
    const joinRoom=async()=>{
        setLoading(true)
        if(name===""){
            setError(true)
            setErrorMessage('Enter name to join room')
            setLoading(false)
            return
        }else if(roomID===""){
            setError(true)
            setErrorMessage('Enter room ID to join room')
            setLoading(false)
            return
        }else if(roomId){
            setError(true)
            setErrorMessage('You are already in a room')
            setLoading(false)
            return
        }
        const room = await checkRoom(roomID)
        if(!room){
            setError(true)
            setErrorMessage('Room does not exist')
            setLoading(false)
            return
        }else{
        socket.emit("joinRoom",{roomID,name,canEdit:false})
        setRoomId(roomID)
            me(name)
            navigate("/room")
            setName("")
        }
        setRoomID("")
        setLoading(false)
    }
    const createNewRoom=async ()=>{
        setLoading(true)
        if(name===""){
            setError(true)
            setErrorMessage('Enter name to create room')
            setLoading(false)
            return
        }else if(roomId){
            setError(true)
            setErrorMessage('You are already in a room')
            setLoading(false)
            return
        }else if(name.length>10){
            setError(true)
            setErrorMessage('Name should be less than 10 characters')
            setLoading(false)
            return
        }else{
            setLoading(false)
        }
        me(name)
        setLoading(false)
        setName("")
        const proceedCreate = (id)=>{
            const newRoomId = id
            setRoomId(newRoomId)
            socket.emit("createRoom", { newRoomId, name , canEdit:true});
            setRoomID("")
            navigate("/room")
            setLoading(false)
        }
        if(socket.id){
            proceedCreate(socket.id)
        }else{
            socket.once("connect", ()=>{
                proceedCreate(socket.id)
                setLoading(false)
            })
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-slate-800 to-blue-700">
            <div className="flex flex-col gap-6 p-8 rounded-3xl shadow-2xl bg-slate-800 w-full max-w-md border border-blue-500/30 backdrop-blur-lg">
                <div className="flex flex-row justify-center items-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-lg">
                        New Room
                    </h1>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <input
                            placeholder="Enter Room ID (Optional for new room)"
                            type="text"
                            className="bg-slate-700/80 rounded-xl text-white w-full p-4 outline-none border border-blue-500/20 focus:border-blue-400 transition-all duration-200 shadow-inner placeholder:text-slate-400"
                            onChange={onRoom}
                            value={roomID}
                        />
                        <input
                            placeholder="Enter Your Name"
                            type="text"
                            className="bg-slate-700/80 rounded-xl text-white w-full p-4 outline-none border border-blue-500/20 focus:border-blue-400 transition-all duration-200 shadow-inner placeholder:text-slate-400"
                            onChange={onName}
                            value={name}
                        />
                    </div>
                    <div className="flex flex-row justify-between gap-4">
                        <button onClick={joinRoom} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-3 hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 text-white font-bold shadow-lg hover:scale-105 active:scale-95 hover:cursor-pointer">
                            Join
                        </button>
                        <button onClick={createNewRoom} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-3 hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 text-white font-bold shadow-lg hover:scale-105 active:scale-95 hover:cursor-pointer">
                            Create
                        </button>
                    </div>
                </div>
            </div>
            <ErrorPage onClose={()=>{setError(false)}} show={error} errorMessage={errorMessage} />
            <LoaderOverlay show={loading} />
        </div>
    )
}

export default New;