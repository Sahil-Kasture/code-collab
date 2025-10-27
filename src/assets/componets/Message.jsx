import React from "react";

function Message(props){
    const isOwn = props.sender === props.username;
    return(
        <div className={`flex flex-col gap-1 p-3 rounded-xl  shadow ${isOwn ? 'bg-blue-600/80 text-white self-end' : 'bg-slate-700/80 text-blue-100 self-start'} max-w-2xl`}>
            <span className="font-semibold">{props.username}</span>
            <span className="text-sm">{props.text}</span>
        </div>
    )}

export default Message;