import React, { useState, useEffect } from "react";
import socket from "../scripts/sockets";
import { useAuth } from "../context/JoinContext";
import { useEditor } from "../context/EditorContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as Y from "yjs";

const AIAgentChat = () => {
  const { roomId, user, file ,messages,setMessages ,canChat} = useAuth();
  const { code, ydocRef } = useEditor();
  
  const [input, setInput] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!canChat) return;
    try {
      const userMsg = { sender: user, text: input };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      socket.emit("toAgent", {
        roomId,
        message: input,
        code,
        lang: file.language,
        token: window.localStorage.getItem("token"),
        name:window.localStorage.getItem('username')
      });
    } catch {}
  };

  useEffect(() => {
    socket.on("fromAgent", ({from,text,code,instructions}) => {
      if (from === "ai") {
        setMessages((prev) => [...prev, { sender: "ai", text: text }]);
      }
      if(from==='ai'&&instructions){
        setMessages((prev) => [...prev, { sender: "ai", text: instructions }]);
      }
      if(code && ydocRef.current) {
        const ydoc = ydocRef.current;
        const ytext = ydoc.getText("monaco");
        ytext.delete(0, ytext.length);
        ytext.insert(0, code);
        const update = Y.encodeStateAsUpdate(ydoc);
        socket.emit("yjs-update", { roomId, update });
      }
    }); 
    return () => {
      socket.off("fromAgent");
      socket.off("yjs-update");
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 shadow-lg rounded-lg min-w-[200px] w-auto">
      <div className="flex flex-col h-full justify-between">
        <div
          className="flex flex-col-reverse overflow-y-auto scrollbar scrollbar-thin p-4"
          style={{ height: "calc(87vh - 200px)" }}
        >
          {[...messages].reverse().map((msg, index) => {
            const isUser = msg.sender === user;
            return (
              <div
                key={index}
                className={`flex w-full ${
                  isUser ? "justify-end" : "justify-start"
                } py-1`}
              >
                <div
                  className={`flex items-end gap-2 ${
                    isUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className="flex flex-col justify-end items-center">
                    <span
                      className={`font-bold rounded-full w-8 h-8 flex items-center justify-center text-white text-lg mx-auto ${
                        isUser
                          ? "bg-blue-500 dark:bg-blue-600"
                          : "bg-purple-500 dark:bg-purple-600"
                      }`}
                    >
                      <span className="material-icons-round text-white text-base">
                        {isUser ? "person" : "smart_toy"}
                      </span>
                    </span>
                  </div>
                  <div
                    className={`
                      ${
                        isUser
                          ? "bg-blue-600 dark:bg-blue-700 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      }
                      px-4 py-2 max-w-[70%] break-words rounded-2xl
                      ${isUser ? "rounded-br-none" : "rounded-bl-none"}
                      shadow flex flex-col justify-end
                    `}
                    style={{
                      wordBreak: "break-word",
                      display: "flex",
                    }}
                  >
                    <div
                      className={`text-xs opacity-70 mb-1 ${
                        isUser
                          ? "text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {isUser ? "You" : "AI Assistant"}
                    </div>
                    <div
                      className="w-full break-words"
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        alignSelf: "flex-end",
                      }}
                    >
                      {isUser ? (
                        msg.text
                      ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center p-5 border border-gray-300 dark:border-gray-600 rounded-full mt-2 px-2 bg-gray-50 dark:bg-gray-700 p-4">
          <form
            className="flex p-1 items-center h-1 w-full"
            onSubmit={handleSend}
          >
            <input
              type="text"
              className="flex-1 bg-transparent text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 rounded-full outline-none"
              placeholder="Ask the AI agent..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className={`flex items-center justify-center px-3 py-2 rounded-full font-bold transition-all duration-200 ${
                input === "" ? " cursor-not-allowed opacity-60" : "active:scale-95"
              }`}
              disabled={(input === '' || !canChat)}
              style={{
                boxShadow:
                  input === ""
                    ? "none"
                    : "0 4px 14px 0 rgba(0, 120, 255, 0.15)",
                border: "none",
              }}
            >
              <span className="material-icons-round text-blue-600 dark:text-blue-400 text-2xl">
                send
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAgentChat;
