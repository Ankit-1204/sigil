import React from "react";
import { useState } from "react";

export const InputArea=({onSend})=>{
    const [input, setInput] = useState("");
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          onSend(input);
          setInput('');
        }
    };
    
    return(
    <div className="flex items-center gap-2 border-t bg-slate-700 p-2">
            <textarea onKeyDown={handleKeyDown} value={input} className="flex-grow border rounded-lg p-2 outline-none" onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
    </div>)
}