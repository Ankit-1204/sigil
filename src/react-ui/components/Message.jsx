import React from "react";

export const MessageArea=({messages})=>{

    return(

        <div className='flex-grow overflow-y-auto p-2 space-y-2'>
            {messages.map((msg,index)=>(<div key={index} className={`p-2 rounded-lg ${
          msg.role === 'user' ? 'bg-slate-900 self-end text-right' : 'bg-slate-800 self-start text-left'
        } break-words max-w-full`}>{msg.text}, {msg.role}</div>))}
           </div>
    )
}