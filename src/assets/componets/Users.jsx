import React, { useState } from "react";
import socket from '../scripts/sockets';
import { useAuth } from "../context/JoinContext";

const Users = ({ users_data, isAdmin }) => {
  const { roomId } = useAuth();
  const [search, setSearch] = useState("");

  // Filter users based on search query (case-insensitive)
  const filteredUsers = Object.entries(users_data).filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  // Toggle edit permission
  const toggleEdit = (socketId, currentPermission, name) => {
    if (socketId === socket.id) {
      return;
    }
    const newPermission = !currentPermission;

    socket.emit("toggleUserEdit", { roomId, name, socketId, canEdit: newPermission });
  };

  // Toggle chat permission
  const toggleChat = (socketId, currentPermission, name) => {
    const newPermission = !currentPermission;

    socket.emit("toggleUserChat", { roomId, name, socketId, canChat: newPermission });
  };

  // Remove user from room
  const removeUser = (socketId, name) => {
    socket.emit("removeUser", { roomId, name, socketId });
  };

  return (
    <main className="p-4 space-y-4 h-[600px]">
      {/* Search Bar */}
      <div className="relative">
        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          search
        </span>
        <input
          type="search"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition duration-200"
        />
      </div>

      {/* Active Users Header */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        Active Users ({filteredUsers.length})
      </h2>

      {/* Users List Container */}
      <div className="overflow-y-auto max-h-[500px]">
        <ul className="space-y-2 max-h-[470px]">
          {filteredUsers.map(([name, user]) => {
            const role = user.isAdmin ? "admin" : user.canEdit ? "editor" : "viewer";

            const roleColors = {
              admin: { 
                border: "border-blue-500", 
                bg: "bg-blue-50/50 dark:bg-blue-900/20", 
                text: "text-blue-600 dark:text-blue-400" 
              },
              editor: { 
                border: "border-green-500", 
                bg: "bg-green-50/50 dark:bg-green-900/20", 
                text: "text-green-600 dark:text-green-400" 
              },
              viewer: { 
                border: "border-amber-500", 
                bg: "bg-amber-50/50 dark:bg-amber-900/20", 
                text: "text-amber-600 dark:text-amber-400" 
              },
            };

            const colors = roleColors[role.toLowerCase()];

            return (
              <li
                key={user.socketId}
                className={`flex items-center justify-between p-3 rounded-lg group border-l-4 ${colors.border} ${colors.bg} relative hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
              >
                {/* User Info */}
                <div className="flex items-center min-w-0">
                  <div className="relative flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <span className="material-icons-outlined text-gray-500 dark:text-gray-300">
                      person
                    </span>
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></span>
                  </div>
                  <div className="ml-3 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {name}
                    </p>
                    <span className={`text-xs ${colors.text} font-semibold`}>
                      {role}
                    </span>
                  </div>
                </div>

                {/* Current Permissions */}
                <div
                  className={`flex items-center space-x-2 text-gray-500 dark:text-gray-400 ${
                    isAdmin ? "group-hover:opacity-0 transition-opacity duration-200" : ""
                  }`}
                >
                  {user.canEdit && (
                    <span className="material-icons-outlined text-lg text-green-500 dark:text-green-400" title="Can edit">
                      edit
                    </span>
                  )}
                  {user.canChat && (
                    <span className="material-icons-outlined text-lg text-blue-500 dark:text-blue-400" title="Can chat">
                      chat_bubble
                    </span>
                  )}
                  {!user.canEdit && !user.canChat && (
                    <span className="material-icons-outlined text-lg text-gray-400 dark:text-gray-500" title="No permissions">
                      block
                    </span>
                  )}
                </div>

                {/* Admin Hover Action Buttons */}
                {isAdmin && (
                  <div className="flex items-center space-x-1 absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                    {/* Toggle Edit */}
                    <button
                      onClick={() => toggleEdit(user.socketId, user.canEdit, name)}
                      aria-label={`Toggle editing permission for ${name}`}
                      className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                    >
                      <span className="material-icons-outlined text-xl">
                        {user.canEdit ? 'edit_off' : 'edit'}
                      </span>
                    </button>

                    {/* Toggle Chat */}
                    <button
                      onClick={() => toggleChat(user.socketId, user.canChat, name)}
                      aria-label={`Toggle chat permission for ${name}`}
                      className="p-2 rounded-full hover:cursor-pointer text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      <span className="material-icons-outlined text-xl">
                        {user.canChat ? 'mic_off' : 'mic'}
                      </span>
                    </button>

                    {/* Remove User */}
                    <button
                      onClick={() => removeUser(user.socketId, name)}
                      aria-label={`Remove ${name}`}
                      className="p-2 rounded-full hover:cursor-pointer text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                    >
                      <span className="material-icons-outlined text-xl">person_remove</span>
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
};

export default Users;
