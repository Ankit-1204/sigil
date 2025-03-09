import React from 'react';
import { useState , useEffect} from 'react';
import axios from "axios"
import './Window.css'
const API = 'http://127.0.0.1:8080/chat'
export const Chat= ({ initialPrompt,windowProp , messageProp})=>{
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
        console.log(response.data.reply)
        setMessages([...newMessage,{text:response.data.reply, role:'model'}])
    }
    return(
        <div className={`flex flex-col w-full max-w-md h-80 overflow-hidden pb-[3px] bg-cyan-500 rounded-xl shadow-xl ${windowProp || ""} `}>
           <div className= {`flex py-2 bg-cyan-300 justify-center font-bold ${messageProp || ""}`}>ChatBot</div> 
           <div className='flex-grow overflow-y-auto p-2 space-y-2'>
            {messages.map((msg,index)=>(<div key={index} className={`p-2 rounded-lg ${
          msg.role === 'user' ? 'bg-blue-700 self-end text-right' : 'bg-gray-700 self-start text-left'
        } break-words max-w-full`}>{msg.text}, {msg.sender}</div>))}
           </div>
           <div className="flex items-center gap-2 border-t bg-blue-600 p-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
            <button onClick={handleSend}>Send</button>
            </div>
        </div>
        
    )
}