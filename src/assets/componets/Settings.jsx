import React, { useState, useEffect } from "react";
import { useAuth } from "../context/JoinContext";
import socket from "../scripts/sockets";

const RoomSettings = ({ setActivePanel }) => {
  const {
    isPublic,
    roomId,
    setAdmin,
    setIsPublicState,
    canEdit,
    canChat,
    setRoomId,
    roomName,
    setRoomName,
  } = useAuth();
  const [chatEnabled, setChatEnabled] = useState(canChat);
  const [editingEnabled, setEditingEnabled] = useState(canEdit);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // compute next state and emit that exact value (avoids race/stale close)
  const togglePublic = () => {
    const next = !isPublic; // ensure isPublic is boolean in context; if ref use isPublic.current
    socket.emit("toggleCollab", { roomId, collab: next });
    setIsPublicState(next);
  };

  const toggleChat = () => {
    const next = !chatEnabled;
    socket.emit("toggleChat", { roomId, chat: next });
    setChatEnabled(next);
  };

  const toggleEditing = () => {
    const next = !editingEnabled;
    socket.emit("toggleEditing", { roomId, edit: next });
    setEditingEnabled(next);
  };

  const deleteRoom = () => {
    socket.emit("deleteRoom", { roomId, token: localStorage.getItem("token") });
  };

  const changeRoomName = () => {
    if(roomName.length > 10) {
      setError(true);
      setErrorMessage("Room name must be less than 10 characters");
      return;
    }else{
      setError(false);
      setErrorMessage("");
    }
    socket.emit("changeRoomName", { roomId, newName: roomName ,token: localStorage.getItem("token")});
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Room Settings */}
      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        <div className="space-y-6 flex flex-col justify-between">
          {/* Room Info */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
              Room Settings
            </h3>
            <div className="space-y-4">
              {/* Room Name */}
              <div className="flex items-center justify-between">
                <label
                  htmlFor="room-name"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300"
                >
                  Room Name
                </label>
                <input
                  id="room-name"
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.currentTarget.value)}
                  className="w-2/3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-1.5 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
              <div className="flex items-center justify-end">
                <button onClick={changeRoomName} class="flex min-w-[80px] max-w-[200px] hover:bg-[#1380ec]/80 hover:cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#1380ec] text-white text-sm font-bold leading-normal tracking-[0.015em]">
                  <span class="truncate">Save</span>
                </button>
              </div>
              {/* Public Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Public Room
                </span>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={togglePublic}
                      className="sr-only"
                    />
                    <div className="block bg-gray-200 dark:bg-gray-600 w-10 h-6 rounded-full"></div>
                    <div
                      className={`dot absolute left-1 top-1 w-4 h-4 rounded-full transition ${
                        isPublic
                          ? "translate-x-4 bg-blue-500 dark:bg-blue-400"
                          : "bg-white dark:bg-gray-300"
                      }`}
                    ></div>
                  </div>
                </label>
              </div>
              {/* chat Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Enable Chat
                </span>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={chatEnabled}
                      onChange={toggleChat}
                      className="sr-only"
                    />
                    <div className="block bg-gray-200 dark:bg-gray-600 w-10 h-6 rounded-full"></div>
                    <div
                      className={`dot absolute left-1 top-1 w-4 h-4 rounded-full transition ${
                        chatEnabled
                          ? "translate-x-4 bg-blue-500 dark:bg-blue-400"
                          : "bg-white dark:bg-gray-300"
                      }`}
                    ></div>
                  </div>
                </label>
              </div>
              {/* Editing Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Enable Editing
                </span>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={editingEnabled}
                      onChange={toggleEditing}
                      className="sr-only"
                    />
                    <div className="block bg-gray-200 dark:bg-gray-600 w-10 h-6 rounded-full"></div>
                    <div
                      className={`dot absolute left-1 top-1 w-4 h-4 rounded-full transition ${
                        editingEnabled
                          ? "translate-x-4 bg-blue-500 dark:bg-blue-400"
                          : "bg-white dark:bg-gray-300"
                      }`}
                    ></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Room Options */}
          {/* <div className="space-y-2 border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
            {[
              { icon: "history", text: "Room History" },
              { icon: "notifications", text: "Notifications" },
            ].map((item) => (
              <button
                key={item.text}
                className="w-full flex items-center justify-between text-left bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-3 rounded-lg text-sm transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="material-icons text-gray-600 dark:text-gray-300 text-xl">
                    {item.icon}
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">{item.text}</span>
                </span>
                <span className="material-icons text-gray-600 dark:text-gray-300">
                  chevron_right
                </span>
              </button>
            ))}
          </div> */}

          {/* Admin Controls */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 mt-6">
              Admin Controls
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setActivePanel("users")}
                className="w-full cursor-pointer text-left bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-colors text-gray-900 dark:text-gray-100"
              >
                Manage Users
              </button>
              <button
                onClick={() => setActivePanel("chat")}
                className="w-full cursor-pointer text-left bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-colors text-gray-900 dark:text-gray-100"
              >
                Clear Editor Content
              </button>
              <button
                onClick={deleteRoom}
                className="w-full cursor-pointer text-left text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Delete Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomSettings;
