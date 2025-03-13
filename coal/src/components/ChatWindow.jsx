import React from 'react';
import { useState , useEffect, useRef } from 'react';
import axios from "axios"
import './Window.css'
import { ChatBar } from './ChatBar';
import { MessageArea } from './Message';
import { InputArea } from './Input';
export const Chat= ({ windowProp , messageProp, handleClick,apiUrl})=>{
    const [messages, setMessages] = useState([]);
    
    return(
        <div className={`flex flex-col w-full h-full overflow-hidden pb-[3px] bg-slate-800 rounded-xl shadow-xl ${windowProp || ""} `}>
           <ChatBar handleClick={handleClick} messageProp={messageProp}/>
           <MessageArea messages={messages} />
           <InputArea messages={messages} setMessages={setMessages} apiUrl={apiUrl}/>
        </div>
    )
}