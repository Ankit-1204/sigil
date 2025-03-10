import React from 'react';
import { useState , useEffect, useRef } from 'react';
import axios from "axios"
import './Window.css'
import { Rnd } from "react-rnd";
const API = 'http://127.0.0.1:8080/chat'
export const Chat= ({ initialPrompt,windowProp , messageProp, handleClick})=>{
    const [input, setInput] = useState("");
    const Prompt=initialPrompt || "You are a helpfull bot. Talk like batman."
    const [messages, setMessages] = useState([]);
    
    const handleSend= async ()=>{
        if(!input.trim()){
            return;
        }
        const newMessage = [...messages,{ text: input, role: "user" }];
        setMessages(newMessage)
        setInput('')

        const response= await axios.post(API,{system: initialPrompt,message:newMessage})
        setMessages([...newMessage,{text:response.data.reply, role:'model'}])
    }
    return(
        <Rnd
        minWidth={200}
        minHeight={100}
        bounds="window"
        dragHandleClassName="chat-drag-handle"
    >
        <div className={`flex flex-col w-full max-w-md h-80 overflow-hidden pb-[3px] bg-cyan-500 rounded-xl shadow-xl ${windowProp || ""} `}>
           <div className= {`relative py-2 bg-cyan-300 font-bold chat-drag-handle cursor-move text-center  ${messageProp || ""}`}>ChatBot <button onClick={()=>handleClick()} className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-500 text-white rounded-full px-3 py-1 text-sm hover:bg-red-600">X</button></div> 
           <div className='flex-grow overflow-y-auto p-2 space-y-2'>
            {messages.map((msg,index)=>(<div key={index} className={`p-2 rounded-lg ${
          msg.role === 'user' ? 'bg-blue-700 self-end text-right' : 'bg-gray-700 self-start text-left'
        } break-words max-w-full`}>{msg.text}, {msg.sender}</div>))}
           </div>
           <div className="flex items-center gap-2 border-t bg-blue-600 p-2">
            <input type="text" value={input} className="flex-grow border rounded-lg p-2 outline-none" onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
            <button onClick={handleSend}>Send</button>
            </div>
        </div>
        </Rnd>
    )
}