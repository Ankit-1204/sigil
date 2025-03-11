import React from 'react';
import { useState , useEffect, useRef } from 'react';
import axios from "axios"
import './Window.css'
import { ChatBar } from './ChatBar';
import { MessageArea } from './Message';
import { InputArea } from './Input';
const API = 'http://127.0.0.1:8080/chat'
export const Chat= ({ initialPrompt,windowProp , messageProp, handleClick,apiKey})=>{
    const Prompt=initialPrompt || "You are a helpfull bot. Answer All Queries."
    const [messages, setMessages] = useState([]);
    
    return(
        <div className={`flex flex-col w-full h-full overflow-hidden pb-[3px] bg-slate-800 rounded-xl shadow-xl ${windowProp || ""} `}>
           <ChatBar handleClick={handleClick} messageProp={messageProp}/>
           <MessageArea messages={messages} />
           <InputArea messages={messages} setMessages={setMessages} apiKey={apiKey}/>
        </div>
    )
}