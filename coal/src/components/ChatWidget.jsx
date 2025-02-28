import { useState } from 'react'
import { Chat } from './ChatWindow'

export const ChatWidget= ()=> {
    const [active,setActive]=useState(false)
    function handleClick (){
        setActive(!active)
    }
    return(
        <div className='body'>
            {active ? <Chat/> :<buttton onClick={()=>handleClick()}> <FontAwesomeIcon icon="fa-regular fa-comment" /> </buttton>}
        </div>

    )
}