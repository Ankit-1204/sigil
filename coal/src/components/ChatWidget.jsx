import { useState } from 'react'
import { Chat } from './ChatWindow'
import  {FontAwesomeIcon}  from '@fortawesome/react-fontawesome'
import { faMessage, faPenNib } from '@fortawesome/free-solid-svg-icons'
export const ChatWidget= ({apiUrl, initialPrompt, widgetProp ,windowProp , messageProp})=> {
    const [active,setActive]=useState(false)
    function handleClick (){
        setActive(!active)
    }
    return(
        <div className={'widgetProp'}>
            {active ? <Chat initialPrompt='Talk like superman' handleClick={handleClick}/> :<button onClick={()=>handleClick()}> <FontAwesomeIcon icon={faMessage} /> </button>}
        </div>

    )
}