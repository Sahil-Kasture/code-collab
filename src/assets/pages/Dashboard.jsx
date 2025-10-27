import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/JoinContext";
import socket from "../scripts/sockets";
import API from "../api/Api"; 
import ErrorPage from "../componets/Error";
import LoaderOverlay from "../componets/Loader";
import { useEditor } from "../context/EditorContext";

const Dashboard = () => {
  const { user, roomId, setRoomId, setUser, setUsers, setAdmin,
     setCanChat, setCanEdit ,setRoomName } = useAuth();
  const {
    editorRef,
    monacoRef,
    ydocRef,
    bindingRef,
    awarenessRef,}=useEditor()
  
  const [roomID, setRoomID] = useState("");
  const [pastRooms, setPastRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const name = user;

  useEffect(() => {
    setRoomId(null);
    socket.disconnect();
    socket.connect();
    socket.auth = { token: localStorage.getItem("token") };
    editorRef.current = null;
    monacoRef.current = null;
    ydocRef.current = null;
    bindingRef.current = null;
    awarenessRef.current = null;
  }, []);

  useEffect(() => {
    const fetchPastRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.post("/pastRooms", { token });
        for(let room of res.data.rooms){
        }
        setPastRooms(res.data.rooms || []);
      } catch (err) {
        console.error("Error fetching past rooms:", err);
      }
    };
    fetchPastRooms();
  }, []);

  const onRoom = (e) => setRoomID(e.target.value);

  const joinRoom = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      socket.emit("joinRoom", { roomID, name, token }, (response) => {
        if (response.success) {
          setAdmin(response.isAdmin);
          setCanChat(response.canChat);
          setCanEdit(response.canEdit);
          setRoomId(roomID);
          setUsers(response.users);
          setRoomID("");
          setRoomName(response.roomName);
          setLoading(false);
          navigate("/room");
        } else {
          setErrorMessage(response.message || "Failed to join room");
          setError(true);
          setLoading(false);
        }
      });
    } catch (err) {
      setErrorMessage("Error joining room");
      setError(true);
      setLoading(false);
    }
  };

  const createNewRoom = async () => {
    setLoading(true);
    socket.disconnect();
    socket.connect();
    socket.auth = { token: localStorage.getItem("token") };
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const newRoomId = socket.id;
    setRoomId(newRoomId);
    setRoomID("");
    const token = localStorage.getItem("token");
    socket.emit("createRoom", { newRoomId, name, token }, (response) => {
      if (response.success) {
        setUsers(response.users);
        setRoomId(response.roomId);
        setRoomName(response.roomName);
        setLoading(false);
        navigate("/room");
      } else {
        setError(true);
        setErrorMessage(response.message || "Failed to create room");
        setLoading(false);
      }
    });
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  const joinExistingRoom = async (roomId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      socket.emit("joinRoom", { roomID: roomId, name, token }, (response) => {
        if (response.success) {
          setAdmin(response.isAdmin);
          setCanChat(response.canChat);
          setCanEdit(response.canEdit);
          setRoomId(roomId);
          setUsers(response.users);
          setRoomName(response.roomName);
          setLoading(false);
          navigate("/room");
        }
      });
    } catch (err) {
      console.error("Error joining room:", err);
    }
  };

  useEffect(() => {
    socket.on("error", (message) => {
      setErrorMessage(message);
      setError(true);
    });
    return () => socket.off("error");
  }, []);

  useEffect(() => {
    if (error) setLoading(false);
  }, [error]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 font-display text-gray-900 dark:text-white min-h-screen w-full flex flex-col overflow-x-hidden">
      <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col max-w-[960px] flex-1">
          {/* Header */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-4 sm:px-10 py-3">
            <div className="flex items-center gap-4 text-gray-900 dark:text-white">
              <div className="text-blue-600 dark:text-blue-400">
                <span className="material-symbols-outlined text-3xl">code_blocks</span>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Code Collab</h2>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Welcome, {user}!</p>
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 hover:cursor-pointer transition-colors">
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </header>

          {/* Main */}
          <main className="py-10 px-4 sm:px-10 flex-1 flex flex-col gap-10">
            {/* Create/Join Rooms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Create Room */}
              <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 justify-center items-center text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-5xl">add_circle</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Room</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs text-center">
                  Start a new coding session and invite your team to collaborate in real-time.
                </p>
                <button onClick={createNewRoom} className="w-full flex justify-center h-10 p-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 hover:cursor-pointer text-white rounded-lg font-bold transition-colors mt-2">
                  Create Room
                </button>
              </div>

              {/* Join Room */}
              <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 justify-center items-center text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-5xl">login</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Join Room</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs text-center">
                  Enter a room code to join an existing coding session.
                </p>
                <div className="flex gap-2 w-full mt-2">
                  <input
                    type="text"
                    placeholder="Enter room code..."
                    value={roomID}
                    onChange={onRoom}
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 px-3 py-2 transition-colors"
                  />
                  <button onClick={joinRoom} className="h-10 px-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Join
                  </button>
                </div>
              </div>
            </div>

            {/* Past Rooms */}
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Past Rooms</h2>
              <div className="flex flex-col gap-4">
                {pastRooms.map((room) => (
                  <div key={room.roomId} className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          {room.active ? (
                            <>
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </>
                          ) : (
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-400 dark:bg-gray-500"></span>
                          )}
                        </span>
                        <p className={`text-sm font-medium ${room.active ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                          {room.active ? "Active" : "Inactive"}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{room.roomName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {room.inactiveAt ? `Ended ${new Date(room.inactiveAt).toLocaleString()}` : "Ongoing"}
                        </p>
                      </div>
                    </div>
                    <button
                      style={{display: room.active ? "block" : "none"}}
                      onClick={() => joinExistingRoom(room.roomId)}
                      className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 font-bold tracking-[0.015em] transition-colors bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                    >
                      Rejoin
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </main>

          <footer className="border-t border-gray-200 dark:border-[#233648] px-4 sm:px-10 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="text-[#1173d4]">
                  <span className="material-symbols-outlined text-3xl">code_blocks</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">© 2025 Sahil Kasture. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <ErrorPage errorMessage={errorMessage} onClose={() => setError(false)} show={error} />
      <LoaderOverlay show={loading} />
    </div>
  );
};

export default Dashboard;
