import React ,{useState,useEffect} from "react";
import socket from "../scripts/sockets";
import { useAuth } from "../context/JoinContext";

function MessageBox(props) {
    const {users,user,roomId,canChat,isAdmin,setUsersList}=useAuth()
    const [message, setMessage] = useState("");
    const [height, setHeight] = useState('10px');
    
      const handleResize = () => {
        const newHeight = window.innerHeight * 0.7; // 60% of viewport height
        setHeight(`${newHeight}px`);
      }
      useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call to set height
        return () => window.removeEventListener('resize', handleResize);
      }, []);
    useEffect(() => {
        socket.removeAllListeners("receiveMessage")
        socket.on("receiveMessage", (msg) => {
            if(msg.from===user) return;
            props.setChat(msg)
        });
    }, []);

    function click(){
        if(message==="") return;
        const chat={
            from:user,
            text:message,
           }
        socket.emit("sendMessage",{roomId,chat})
        props.setChat(chat)
        setMessage("")
    }
    
    function handleChange(e){
        const value=e.target.value
        setMessage(value)
    }

    function none(){
        if(message==="") return;
        setMessage('')
    }
    const handleEnter=(e)=>{
        if(!isAdmin && !canChat) return;
        e.key ==="Enter" ? click():null;
    }

    return (
            <div className="flex flex-col h-[76vh] justify-between p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg min-w-[200px] w-auto">
                <div
                    className="flex flex-col-reverse overflow-auto scrollbar scrollbar-thin"
                    style={{
                        height: height,
                        "--sb-track": "transparent"
                    }}
                >
                    {[...(props.data || [])].reverse().map((msg, index) => {
                        if (msg.from) {
                            const isSelf = msg.from === user;
                            return (
                                <div key={index} className={`flex w-full ${isSelf ? "justify-end" : "justify-start"} py-1`}>
                                    <div className={`flex items-end gap-2 ${isSelf ? "flex-row-reverse" : "flex-row"}`}>
                                        <div className="flex flex-col justify-end items-center">
                                            <span className="font-bold rounded-full bg-blue-500 dark:bg-blue-600 w-8 h-8 flex items-center justify-center text-white text-lg mx-auto">
                                                <span className="material-icons-round text-white text-base">person</span>
                                            </span>
                                        </div>
                                        <div className={`
                                            ${isSelf ? "bg-blue-600 dark:bg-blue-700 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"}
                                            px-4 py-2 max-w-[70%] break-words rounded-2xl
                                            ${isSelf ? "rounded-br-none" : "rounded-bl-none"}
                                            shadow flex flex-col justify-end
                                        `} style={{ wordBreak: "break-word", display: "flex" }}>
                                            <div className={`text-xs opacity-70 mb-1 ${isSelf ? "text-white" : "text-gray-500 dark:text-gray-400"}`}>{msg.from}</div>
                                            <div className="w-full break-words" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", alignSelf: "flex-end" }}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full mt-4 px-2 bg-gray-50 dark:bg-gray-700">
                    <input
                        className="flex-1 bg-transparent text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 rounded-full outline-none"
                        type="text"
                        value={message}
                        onChange={handleChange}
                        onKeyDown={handleEnter}
                        placeholder="Type a message..."
                    />
                    <button
                        className={`flex items-center justify-center px-3 py-2 rounded-full font-bold transition-all duration-200
                            ${message === ""
                                ? " cursor-not-allowed opacity-60"
                                : "active:scale-95"
                            }`}
                        onClick={message === "" ? none : click}
                        aria-label="Send"
                        disabled={!isAdmin && (message === "" || !canChat)}
                        style={{
                            boxShadow: message === ""
                                ? "none"
                                : "0 4px 14px 0 rgba(0, 120, 255, 0.15)",
                            border: "none",
                        }}
                    >
                        <span className="material-icons-round text-blue-600 dark:text-blue-400 text-2xl">send</span>
                    </button>
                </div>
            </div>
        
    )
}

export default MessageBox;
