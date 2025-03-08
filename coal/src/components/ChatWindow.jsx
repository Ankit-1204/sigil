import React from 'react';
import { useState , useEffect} from 'react';
import axios from "axios"
import './Window.css'
const API = 'http://127.0.0.1:8080/chat'
export const Chat= ({apiUrl, initialPrompt,windowProp , messageProp})=>{
    const [input, setInput] = useState("");
    initialPrompt="You are a helpfull bot. Talk like batman."
    const [messages, setMessages] = useState([{text: initialPrompt, role : 'user'}]);
    
    const handleSend= async ()=>{
        if(!input.trim()){
            return;
        }
        const newMessage = [...messages,{ text: input, role: "user" }];
        setMessages(newMessage)
        setInput('')

        const response= await axios.post(API,newMessage)
        console.log(response.data.reply)
        setMessages([...newMessage,{text:response.data.reply, role:'model'}])
    }
    return(
        <div className={'flex flex-col w-full overflow-hidden pb-[3px] bg-cyan-500 size-64 windowProp'}>
           <div className= {'flex py-[5px] bg-cyan-300 justify-center messageProp'}>ChatBot</div> 
           <div className='flex-grow'>
            {messages.map((msg,index)=>(<h3 key={index}>{msg.text}, {msg.sender}</h3>))}
           </div>
           <div className="flex mx-[1px] px-[2px]">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
            <button onClick={handleSend}>Send</button>
            </div>
        </div>
        
    )
}