import React from 'react';
import { useState } from 'react';
import './Window.css'
export const Chat= ({apiUrl, initialPrompt,windowProp , messageProp})=>{
    const [input, setInput] = useState("");
    return(
        <div className={'flex flex-col w-full overflow-hidden pb-[3px] bg-cyan-500 size-64 windowProp'}>
           <div className= {'flex py-[5px] bg-cyan-300 justify-center messageProp'}>ChatBot</div> 
           <div className='flex-grow'></div>
           <div className="flex mx-[1px] px-[2px]">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
            <button >Send</button>
            </div>
        </div>
        
    )
}