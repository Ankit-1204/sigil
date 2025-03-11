import React from "react";

export const ChatBar=({handleClick,messageProp})=>{

    return(
        <div className= {`relative py-2 bg-slate-700 font-bold chat-drag-handle cursor-move text-center  ${messageProp || ""}`}>ChatBot <button onClick={()=>handleClick()} className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-500 text-white rounded-full px-3 py-1 text-sm hover:bg-red-600 margin-2">X</button></div> 
    )
}