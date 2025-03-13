import { useState } from 'react'
import { Chat } from './ChatWindow'
import  {FontAwesomeIcon}  from '@fortawesome/react-fontawesome'
import { faMessage, faPenNib } from '@fortawesome/free-solid-svg-icons'
import { Rnd } from "react-rnd";
export const ChatWidget= ({apiUrl, initialPrompt, widgetProp ,windowProp , messageProp})=> {
    const [active,setActive]=useState(false)
    function handleClick (){
        setActive(!active)
    }
    return(
        <div className={'widgetProp'}>
            {active ? <Rnd
        minWidth={200}
        minHeight={100}
        bounds="window"
        dragHandleClassName="chat-drag-handle"
        
    ><div className='w-200 h-100'><Chat apiUrl={"http://localhost:8080/chat"} initialPrompt='Talk like superman' handleClick={handleClick}/> </div> </Rnd>:<button onClick={()=>handleClick()}> <FontAwesomeIcon icon={faMessage} /> </button>}
        </div>

    )
}