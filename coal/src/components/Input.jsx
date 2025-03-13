import React from "react";
import { useState } from "react";
import axios from "axios";

export const InputArea=({messages,setMessages,apiUrl})=>{
    const [input, setInput] = useState("");
    const handleSend= async ()=>{
        if(!input.trim()){
            return;
        }
        const msg=input
        const newMessage = [...messages,{ text: input, role: "user" }];
        setMessages(newMessage)
        setInput('')
        const response= await axios.post(apiUrl,{message:msg})
        setMessages([...newMessage,{text:response.data.data, role:'model'}])
    }
    return(
    <div className="flex items-center gap-2 border-t bg-slate-700 p-2">
            <input type="text" value={input} className="flex-grow border rounded-lg p-2 outline-none" onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
            <button className='bg-cyan-500 hover:bg-cyan-600' onClick={handleSend}>Send</button>
    </div>)
}