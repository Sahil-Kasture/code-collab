import React, { useState, useEffect } from "react";
import MessageBox from "./Message_box";
import socket from "../scripts/sockets";
import { useAuth } from "../context/JoinContext";
import RoomSettings from "./Settings";
import Users from "./Users";
import AIAgentChat from "./Aiagent";

function Right() {
  const { users, setUsers, isAdmin, setUsersData, isInitializing } = useAuth();
  const [chat, setChat] = useState([]);
  const [activePanel, setActivePanel] = useState("chat");

  useEffect(() => {
    socket.off("roomCreated").on("roomCreated", (joined) => setUsers(joined));
    socket.off("userLeft").on("userLeft", (left) => {
      setUsersData(left);
      setUsers(left);
    });
    socket.off("userJoined").on("userJoined", (joined) => {
      setUsersData(joined);
      setUsers(joined);
      isInitializing.current = true;
      setTimeout(() => (isInitializing.current = false), 200);
    });
  }, []);

  const handlePanelChange = (e) => {
    const panel = e.currentTarget.getAttribute("data-panel");
    setActivePanel(panel);
  };

  const newMessage = (newMsg) => {
    setChat((prev) => [...prev, newMsg]);
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm w-full h-full overflow-hidden">
      <header className="flex flex-wrap justify-between items-center border-b border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-2 sticky top-0 bg-white dark:bg-gray-800 z-10">
        <nav className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
          <button
            data-panel="chat"
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              activePanel === "chat"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
            onClick={handlePanelChange}
          >
            <span className="material-symbols-outlined text-base">forum</span> 
          </button>

          <button
            data-panel="users"
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              activePanel === "users"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
            onClick={handlePanelChange}
          >
            <span className="material-symbols-outlined text-base">group</span>
          </button>

          <button
            data-panel="agent"
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              activePanel === "agent"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
            onClick={handlePanelChange}
          >
            <span className="material-symbols-outlined text-base">smart_toy</span>
          </button>

          {isAdmin && (
            <button
              data-panel="settings"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                activePanel === "settings"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
              onClick={handlePanelChange}
            >
              <span className="material-symbols-outlined text-base">settings</span>
            </button>
          )}
        </nav>
      </header>

      <div className="flex-1 h-full overflow-y-auto p-3 flex flex-col">
        {activePanel === "users" && (
          <div className="flex-1 flex flex-col">
            <Users users_data={users} isAdmin={isAdmin} />
          </div>
        )}
        {activePanel === "chat" && (
          <div className="flex-1 flex flex-col">
            <MessageBox setChat={newMessage} data={chat} />
          </div>
        )}
        {activePanel === "agent" && (
          <div className="flex-1 flex flex-col">
            <AIAgentChat />
          </div>
        )}
        {activePanel === "settings" && (
          <div className="flex-1 flex flex-col">
            <RoomSettings setActivePanel={setActivePanel} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Right;
