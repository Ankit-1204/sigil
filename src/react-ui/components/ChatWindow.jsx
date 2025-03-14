import React from 'react';
import { useChat } from '../hooks/useChat';
import { ChatBar } from './ChatBar';
import { MessageArea } from './Message';
import { InputArea } from './Input';
export const Chat= ({ windowProp , messageProp, handleClick,apiUrl})=>{
    const {message, SendMessage} = useChat(apiUrl);
    
    return(
        <div className={`flex flex-col w-full h-full overflow-hidden pb-[3px] bg-slate-800 rounded-xl shadow-xl ${windowProp || ""} `}>
           <ChatBar handleClick={handleClick} messageProp={messageProp}/>
           <MessageArea messages={message} />
           <InputArea onSend={SendMessage} />
        </div>
    )
}