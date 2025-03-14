import { useState } from "react";
import axios from "axios";
export const useChat=(apiUrl)=>{
    const [message,setMessage]=useState([])
    
    const SendMessage = async(userMessage)=>{
        const newMessage = [...message,{ text: userMessage, role: "user" }];
        setMessage(newMessage)
        try {
            const response= await axios.post(apiUrl,{message:userMessage})
            setMessage([...newMessage,{text:response.data.data, role:'model'}])
        } catch (err) {
            console.error(err);
            setMessage((prev) => [...prev, { role: 'assistant', content: '⚠️ Error!' }]);
        }
    }
    return {message, SendMessage}
}