import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Right from '../componets/Right'
import Header from '../componets/Header'
import { useAuth } from '../context/JoinContext'
import socket from '../scripts/sockets'
import Sandbox from '../componets/Editor'
import { useEditor } from '../context/EditorContext'
const Room = () => {
  const { roomId, user, setUsers, canChat, canEdit,
        setIsPublicState, setCanChat, setCanEdit, 
        setRoomId, setRoomName, setRightPanel ,rightPanel } = useAuth()
  const [width, setWidth] = useState(window.innerWidth)
  const { editorRef,monacoRef,ydocRef,bindingRef,awarenessRef}=useEditor()

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navigate = useNavigate();

  useEffect(() => {
    const leaveRoom = () => {
      console.log("leaving room");
      socket.emit('leavingRoom', { roomId, token: localStorage.getItem("token")});
      setRoomId(null);
      editorRef.current = null;
      monacoRef.current = null;
      ydocRef.current = null;
      bindingRef.current = null;
      awarenessRef.current = null;
    };
  
    const handleBeforeUnload = () => {
      leaveRoom();
    };
  
    const handlePopState = () => {
      leaveRoom();
      navigate('/dashboard');
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [roomId]);

  useEffect(() => {
    const onCollab = collab => setIsPublicState(collab)
    const onChat = chat => setCanChat(chat)
    const onEdit = edit => setCanEdit(edit)

    socket.on('collabToggled', onCollab)
    socket.on('chatToggled', onChat)
    socket.on('editToggled', onEdit)
    socket.on('userUpdated', data => setUsers(data))

    socket.on('updatedUserEdit', data => {
      setUsers(prev => ({ ...prev, ...data }))
    })
    socket.on('updatedUserChat', data => {
      setUsers(prev => ({ ...prev, ...data }))
    })
    socket.on('leave', () => {
      setRoomId(null)
      editorRef.current = null
      monacoRef.current = null
      ydocRef.current = null
      bindingRef.current = null
      awarenessRef.current = null
      navigate('/dashboard')
    })
    socket.on('roomNameChanged', ({newName}) => {
      setRoomName(newName)
    })
    return () => {
      socket.off('collabToggled', onCollab)
      socket.off('chatToggled', onChat)
      socket.off('editToggled', onEdit)
      socket.off('userUpdated')
      socket.off('updatedUserEdit')
      socket.off('updatedUserChat')
      socket.off('leave')
      socket.off('roomNameChanged')
    }
  }, [canChat, canEdit, roomId, user])

  useEffect(() => {
    if(!roomId){
      socket.emit('leavingRoom', { roomId, token: localStorage.getItem("token") });
    }
  }, [roomId, user]);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen w-full flex flex-col">
      <div className="w-full">
        <Header />
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-3 p-3">
        <div className={`w-full h-[88vh] min-h-[50vh] order-1 ${rightPanel ? "lg:col-span-3" : "lg:col-span-4"}`} >
          <Sandbox />
        </div>
        <div className={`w-full h-[88vh] min-h-[50vh] order-2 ${rightPanel ? "lg:col-span-1" : "lg:col-span-0 hidden"}`}>
          <Right />
        </div>
      </div>
    </div>
  )
}

export default Room
